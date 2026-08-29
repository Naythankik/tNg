import { useEffect, useRef, useState } from 'react';

// A grid of square drop targets for product photos: existing/selected images
// preview inside the square, plus one trailing square to add more.
function SquareImageUpload({ files, onChange, existingImages = [], max = 5 }) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  function addFiles(fileList) {
    const incoming = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    const combined = [...files, ...incoming].slice(0, max);
    onChange(combined);
  }

  function removeAt(index) {
    onChange(files.filter((_, i) => i !== index));
  }

  const slotsUsed = existingImages.length + files.length;
  const showAddSlot = slotsUsed < max;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {existingImages.map((img, i) => (
          <div
            key={img.publicId || i}
            className="relative aspect-square w-24 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
          >
            <img src={img.url} alt="" className="h-full w-full object-cover" />
          </div>
        ))}

        {files.map((file, i) => (
          <div
            key={`${file.name}-${i}`}
            className="group relative aspect-square w-24 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
          >
            <img src={previews[i]} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}

        {showAddSlot && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`flex aspect-square w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-stone-400 transition ${
              dragOver ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-stone-300 hover:border-stone-400'
            }`}
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-[11px] leading-tight">Add photo</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <p className="mt-2 text-xs text-stone-400">
        Square photos work best. Up to {max} images — {slotsUsed}/{max} used.
      </p>
    </div>
  );
}

export default SquareImageUpload;
