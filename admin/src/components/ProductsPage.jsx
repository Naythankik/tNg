import { useEffect, useState } from 'react';
import { getProducts, deleteProduct, toggleVariantStock } from '../lib/api';

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

function ProductsPage({ onEdit, refreshKey }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      setProducts(await getProducts());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  async function handleDelete(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleVariant(productId, variantId) {
    try {
      await toggleVariantStock(productId, variantId);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-stone-500">Loading products…</p>;

  return (
    <section>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {products.length === 0 ? (
        <p className="rounded-xl border border-stone-200 bg-white p-5 text-center text-stone-400">
          No products yet. Add one from the "Add Product" tab.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const thumbnail = product.images?.[0]?.url;
            return (
              <article
                key={product._id}
                className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {thumbnail && (
                      <img src={thumbnail} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                      {product.category?.name ?? 'Uncategorized'}
                    </p>
                    <h3 className="truncate text-base font-semibold">{product.title}</h3>
                    <p className="text-xs text-stone-400">
                      {product.hasStock ? 'In stock' : 'All sizes out of stock'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {product.variants.map((variant) => (
                    <div
                      key={variant._id}
                      className="flex items-center justify-between rounded-lg bg-stone-50 px-2.5 py-1.5 text-sm"
                    >
                      <span className="text-stone-600">{variant.label}</span>
                      <span className="font-medium">
                        {variant.discountPrice ? (
                          <>
                            <span className="mr-1.5 text-stone-400 line-through">
                              {formatNaira(variant.price)}
                            </span>
                            {formatNaira(variant.discountPrice)}
                          </>
                        ) : (
                          formatNaira(variant.price)
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleVariant(product._id, variant._id)}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          variant.inStock
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {variant.inStock ? 'In stock' : 'Out of stock'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProductsPage;
