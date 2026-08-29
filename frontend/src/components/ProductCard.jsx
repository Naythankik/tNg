import { useState } from 'react';
import { logOrderInquiry } from '../lib/api';
import { buildWhatsAppOrderLink } from '../utils/whatsapp';
import { BUSINESS_WHATSAPP_NUMBER } from '../constants';

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

function ProductCard({ product }) {
  const inStockVariants = product.variants.filter((v) => v.inStock);
  const [selectedId, setSelectedId] = useState(inStockVariants[0]?._id ?? product.variants[0]?._id);
  const [ordering, setOrdering] = useState(false);
  const imageUrl = product.images?.[0]?.url;

  const selectedVariant = product.variants.find((v) => v._id === selectedId);
  const soldOut = inStockVariants.length === 0;

  async function handleOrderClick() {
    if (!selectedVariant) return;
    setOrdering(true);
    try {
      await logOrderInquiry(product._id, selectedVariant._id);
    } catch {
      // Non-fatal — still let the customer through to WhatsApp even if logging fails.
    } finally {
      setOrdering(false);
    }

    const effectivePrice = selectedVariant.discountPrice ?? selectedVariant.price;
    const link = buildWhatsAppOrderLink({
      phoneNumber: BUSINESS_WHATSAPP_NUMBER,
      productName: product.title,
      size: selectedVariant.label,
      price: formatNaira(effectivePrice),
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

      <div className="mt-3 flex flex-wrap gap-1.5">
        {product.variants.map((variant) => {
          const active = variant._id === selectedId;
          return (
            <button
              key={variant._id}
              type="button"
              disabled={!variant.inStock}
              onClick={() => setSelectedId(variant._id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                !variant.inStock
                  ? 'bg-stone-50 text-stone-300 line-through'
                  : active
                    ? 'bg-brand-navy text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {variant.label}
            </button>
          );
        })}
      </div>

      {selectedVariant && (
        <p className="mt-2 text-lg font-semibold">
          {selectedVariant.discountPrice ? (
            <>
              <span className="mr-2 text-base text-stone-400 line-through">
                {formatNaira(selectedVariant.price)}
              </span>
              {formatNaira(selectedVariant.discountPrice)}
            </>
          ) : (
            formatNaira(selectedVariant.price)
          )}
        </p>
      )}

      {soldOut ? (
        <span className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-400">
          Out of stock
        </span>
      ) : (
        <button
          type="button"
          onClick={handleOrderClick}
          disabled={ordering || !selectedVariant?.inStock}
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {ordering ? 'Opening WhatsApp…' : 'Order via WhatsApp'}
        </button>
      )}
    </article>
  );
}

export default ProductCard;
