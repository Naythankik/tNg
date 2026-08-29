import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '../lib/api';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState(null);

  async function refresh() {
    try {
      setCategories(await getCategories());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd(e) {
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

  async function handleDelete(id) {
    try {
      await deleteCategory(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold">Categories</h2>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="e.g. Parfaits"
          className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand"
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
              onClick={() => handleDelete(cat._id)}
              className="text-stone-400 hover:text-red-600"
              aria-label={`Delete ${cat.name}`}
            >
              ×
            </button>
          </span>
        ))}
        {categories.length === 0 && <p className="text-sm text-stone-400">No categories yet.</p>}
      </div>
    </section>
  );
}

export default CategoriesPage;
