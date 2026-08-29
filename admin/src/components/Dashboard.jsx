import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  deleteCategory,
  getProducts,
  createProduct,
  toggleProductStock,
  deleteProduct,
} from '../lib/api';
import { clearToken } from '../lib/auth';

const emptyForm = { title: '', description: '', price: '', size: '', category: '' };

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

function Dashboard({ onLoggedOut }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
    setCategories(cats);
    setProducts(prods);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
  }, []);

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await createCategory(newCategory.trim());
      setNewCategory('');
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteCategory(id) {
    try {
      await deleteCategory(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateProduct(e) {
    e.preventDefault();
    setError(null);

    if (!form.category) {
      setError('Pick a category first (add one above if the list is empty).');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      files.forEach((file) => data.append('images', file));

      await createProduct(data);
      setForm(emptyForm);
      setFiles([]);
      e.target.reset();
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStock(id) {
    try {
      await toggleProductStock(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
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
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold">Categories</h2>
          <form onSubmit={handleAddCategory} className="mb-4 flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Celebration Cakes"
              className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Add
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat._id}
                className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700"
              >
                {cat.name}
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="text-stone-400 hover:text-red-600"
                  aria-label={`Delete ${cat.name}`}
                >
                  ×
                </button>
              </span>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-stone-400">No categories yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold">Add a product</h2>
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select category…</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              min="0"
              step="1"
              placeholder="Price (₦)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <input
              placeholder="Size (e.g. 8in, serves 12)"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="sm:col-span-2 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              rows={2}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="sm:col-span-2 text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="sm:col-span-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Add product'}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold">Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-medium">{product.title}</td>
                    <td className="py-2 pr-4 text-stone-500">
                      {product.category?.name ?? '—'}
                    </td>
                    <td className="py-2 pr-4">{formatNaira(product.price)}</td>
                    <td className="py-2 pr-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(product._id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.inStock
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {product.inStock ? 'In stock' : 'Out of stock'}
                      </button>
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-stone-400">
                      No products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
