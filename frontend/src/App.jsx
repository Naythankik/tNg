import { buildWhatsAppOrderLink } from './utils/whatsapp';

// Placeholder product until the API is wired up.
const sampleProduct = {
  title: 'Red Velvet Celebration Cake',
  size: '8in, serves 12',
  price: 25000,
  category: 'Celebration Cakes',
};

const businessWhatsAppNumber = '2340000000000'; // TODO: replace with real number, no leading +/0

function App() {
  const orderLink = buildWhatsAppOrderLink({
    phoneNumber: businessWhatsAppNumber,
    productName: sampleProduct.title,
    size: sampleProduct.size,
    price: `₦${sampleProduct.price.toLocaleString()}`,
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <h1 className="text-2xl font-semibold tracking-tight">Confectionery Catalog</h1>
          <p className="text-sm text-stone-500">Browse the menu, order straight to WhatsApp.</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="mb-4 aspect-square rounded-lg bg-stone-100" />
            <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
              {sampleProduct.category}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{sampleProduct.title}</h2>
            <p className="mt-1 text-sm text-stone-500">{sampleProduct.size}</p>
            <p className="mt-2 text-lg font-semibold">
              ₦{sampleProduct.price.toLocaleString()}
            </p>
            <a
              href={orderLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Order via WhatsApp
            </a>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
