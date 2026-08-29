import { useEffect, useState } from 'react';
import { getCategories } from '../lib/api';
import { clearToken } from '../lib/auth';
import ProductsPage from './ProductsPage';
import ProductForm from './ProductForm';
import CategoriesPage from './CategoriesPage';

const TABS = [
  { key: 'products', label: 'Products' },
  { key: 'form', label: 'Add Product' },
  { key: 'categories', label: 'Categories' },
];

function Dashboard({ onLoggedOut }) {
  const [tab, setTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (tab === 'form') {
      getCategories()
        .then(setCategories)
        .catch(() => setCategories([]));
    }
  }, [tab]);

  function goToTab(key) {
    if (key !== 'form') setEditingProduct(null);
    setTab(key);
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setTab('form');
  }

  function handleSaved() {
    setEditingProduct(null);
    setRefreshKey((k) => k + 1);
    setTab('products');
  }

  function handleLogout() {
    clearToken();
    onLoggedOut();
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Take n Go Confectionery</h1>
            <p className="text-sm text-stone-500">Admin dashboard</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            Log out
          </button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => goToTab(t.key)}
              className={`border-b-2 px-3 py-2 text-sm font-medium transition ${
                tab === t.key
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.key === 'form' && editingProduct ? 'Edit Product' : t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        {tab === 'products' && <ProductsPage onEdit={handleEdit} refreshKey={refreshKey} />}

        {tab === 'form' && (
          <ProductForm
            key={editingProduct?._id ?? 'new'}
            product={editingProduct}
            categories={categories}
            onSaved={handleSaved}
            onCancel={() => goToTab('products')}
          />
        )}

        {tab === 'categories' && <CategoriesPage />}
      </main>
    </div>
  );
}

export default Dashboard;
