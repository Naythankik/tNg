// Editable rows for a product's sellable options — e.g. "250ml", "500ml", "1L"
// parfait cups — each with its own price, optional discount price, and stock flag.
const emptyVariant = { label: '', price: '', discountPrice: '', inStock: true };

function VariantsEditor({ variants, onChange }) {
  function updateVariant(index, patch) {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function addVariant() {
    onChange([...variants, { ...emptyVariant }]);
  }

  function removeVariant(index) {
    onChange(variants.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="space-y-2">
        {variants.map((variant, i) => (
          <div key={i} className="grid grid-cols-12 items-center gap-2">
            <input
              required
              placeholder="Volume (e.g. 250ml)"
              value={variant.label}
              onChange={(e) => updateVariant(i, { label: e.target.value })}
              className="col-span-4 rounded-lg border border-stone-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Price (₦)"
              value={variant.price}
              onChange={(e) => updateVariant(i, { price: e.target.value })}
              className="col-span-3 rounded-lg border border-stone-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
            />
            <input
              type="number"
              min="0"
              placeholder="Discount ₦ (optional)"
              value={variant.discountPrice}
              onChange={(e) => updateVariant(i, { discountPrice: e.target.value })}
              className="col-span-3 rounded-lg border border-stone-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none"
            />
            <label className="col-span-1 flex items-center justify-center gap-1 text-xs text-stone-500">
              <input
                type="checkbox"
                checked={variant.inStock}
                onChange={(e) => updateVariant(i, { inStock: e.target.checked })}
              />
              Stock
            </label>
            <button
              type="button"
              onClick={() => removeVariant(i)}
              disabled={variants.length === 1}
              className="col-span-1 text-sm text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-stone-300 disabled:no-underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addVariant}
        className="mt-2 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
      >
        + Add volume
      </button>
    </div>
  );
}

export { emptyVariant };
export default VariantsEditor;
