import { useState } from 'react';
import { createProduct, updateProduct } from '../lib/api';
import SquareImageUpload from './SquareImageUpload';
import VariantsEditor, { emptyVariant } from './VariantsEditor';

function ProductForm({ product, categories, onSaved, onCancel }) {
  const isEditing = Boolean(product);

  const [title, setTitle] = useState(product?.title ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [category, setCategory] = useState(product?.category?._id ?? '');
  const [variants, setVariants] = useState(
    product?.variants?.length
      ? product.variants.map((v) => ({
          label: v.label,
          price: v.price,
          discountPrice: v.discountPrice ?? '',
          inStock: v.inStock,
        }))
      : [{ ...emptyVariant }]
  );
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!category) {
      setError('Pick a category first (add one from the Categories tab if the list is empty).');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', title);
      data.append('description', description);
      data.append('category', category);
      data.append('variants', JSON.stringify(variants));
      files.forEach((file) => data.append('images', file));

      if (isEditing) {
        await updateProduct(product._id, data);
      } else {
        await createProduct(data);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">{isEditing ? 'Edit product' : 'Add a product'}</h2>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Title (e.g. Vanilla Parfait)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="">Select category…</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />

        <div>
          <p className="mb-1 text-sm font-medium">Photos</p>
          <SquareImageUpload
            files={files}
            onChange={setFiles}
            existingImages={isEditing ? product.images : []}
          />
          {isEditing && (
            <p className="mt-1 text-xs text-stone-400">
              Adding new photos here replaces all existing ones for this product.
            </p>
          )}
        </div>

        <div>
          <p className="mb-1 text-sm font-medium">Volumes &amp; pricing</p>
          <VariantsEditor variants={variants} onChange={setVariants} />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add product'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default ProductForm;
