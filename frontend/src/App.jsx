import { useEffect, useState } from 'react';
import { getCategories, getProducts, logOrderInquiry } from './lib/api';
import { buildWhatsAppOrderLink } from './utils/whatsapp';

// TODO: replace with Take n Go Confectionery's real WhatsApp number
// (digits only, country code, no leading + or 0), or set VITE_WHATSAPP_NUMBER.
const businessWhatsAppNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2340000000000';

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

function ProductCard({ product }) {
  const [ordering, setOrdering] = useState(false);
  const imageUrl = product.images?.[0]?.url;

  async function handleOrderClick() {
    setOrdering(true);
    try {
      await logOrderInquiry(product._id);
    } catch {
      // Non-fatal — still let the customer through to WhatsApp even if logging fails.
    } finally {
      setOrdering(false);
    }

    const link = buildWhatsAppOrderLink({
      phoneNumber: businessWhatsAppNumber,
      productName: product.title,
      size: product.size,
      price: formatNaira(product.price),
    });
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-stone-100">
        {imageUrl && (
          <img src={imageUrl} alt={product.title} className="h-full w-full object-cover" />
        )}
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
        {product.category?.name ?? 'Uncategorized'}
      </p>
      <h2 className="mt-1 text-lg font-semibold">{product.title}</h2>
      {product.size && <p className="mt-1 text-sm text-stone-500">{product.size}</p>}
      <p className="mt-2 text-lg font-semibold">{formatNaira(product.price)}</p>

      {product.inStock ? (
        <button
          type="button"
          onClick={handleOrderClick}
          disabled={ordering}
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {ordering ? 'Opening WhatsApp…' : 'Order via WhatsApp'}
        </button>
      ) : (
        <span className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-400">
          Out of stock
        </span>
      )}
    </article>
  );
}

function App() {
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
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <h1 className="text-2xl font-semibold tracking-tight">Take n Go Confectionery</h1>
          <p className="text-sm text-stone-500">Browse the menu, order straight to WhatsApp.</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === null
                  ? 'bg-stone-900 text-white'
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
                    ? 'bg-stone-900 text-white'
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
            {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}?
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-stone-500">No items yet — check back soon!</p>
        )}

        {!loading && !error && products.length > 0 && (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
