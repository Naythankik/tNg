import { useEffect, useState } from 'react';
import { getCategories, getProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';

function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts({ category: activeCategory || undefined })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-navy">Our Menu</h1>
        <p className="text-sm text-stone-500">Browse what's available, order straight to WhatsApp.</p>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === null
                ? 'bg-brand-navy text-white'
                : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => setActiveCategory(cat._id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === cat._id
                  ? 'bg-brand-navy text-white'
                  : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-stone-500">Loading menu…</p>}

      {!loading && error && (
        <p className="text-red-600">
          Couldn't load the menu ({error}). Is the backend running at{' '}
          {import.meta.env.VITE_API_URL || 'http://localhost:5050/api'}?
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-stone-500">No items yet. Check back soon!</p>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Menu;
