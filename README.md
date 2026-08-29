# Take n Go Confectionery — MVP

E-commerce/catalog MVP for Take n Go Confectionery. See `confectionery_mvp_proposal.md`
(also in Downloads) for the full write-up. Three apps live side by side here:

```
confectionery-mvp/
├── frontend/   # Customer-facing catalog — React + Vite + Tailwind
├── admin/      # Admin dashboard — React + Vite + Tailwind
└── backend/    # REST API — Node/Express + MongoDB (Mongoose) + Cloudinary
```

Frontend and admin are wired to the backend API (auth, categories, products, image
upload, WhatsApp inquiry logging) — not just static placeholders.

## Branding
`frontend/public/logo.png` and `admin/public/logo.png` are cropped from a real product
photo (`take_n_go-330ml.jpeg`) rather than vector art, so they're a little soft at
large sizes — fine for the header/favicon use they're in now, but worth swapping for a
proper vector logo if one ever gets made. The color palette in `src/index.css` in both
apps (`@theme { --color-brand: ... }`) was sampled from that same photo (raspberry-red
icon/script, navy wordmark, sky-blue label background) — edit those five variables to
retheme everything at once.

## Getting started

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, Cloudinary keys
npm run dev             # starts the API on http://localhost:5000
npm run seed:admin -- owner@example.com somePassword123   # create the first admin login
```

### 2. Admin dashboard
```bash
cd admin
cp .env.example .env    # VITE_API_URL, defaults to http://localhost:5000/api
npm run dev              # http://localhost:5174 (or next free port)
```
Log in with the admin account you seeded above. The dashboard has three tabs:
- **Products** — grid of all products with a square thumbnail, each size/volume's
  price (and discount price, if set), a per-size in-stock toggle, plus Edit/Delete.
- **Add Product** (relabeled **Edit Product** while editing) — title, description,
  category, a square photo dropzone (click or drag-and-drop, up to 5 images), and a
  volumes/pricing table: add as many sizes as needed (e.g. 250ml / 500ml / 1L for
  parfaits), each with its own price, optional discount price, and stock flag.
- **Categories** — add/delete categories.

Products are modeled as one item with multiple **variants** (size + price + optional
discount + stock), which is why "Take n Go" parfaits sold in several volumes are a
single product with several price rows rather than separate products per size.

### 3. Frontend (customer catalog)
```bash
cd frontend
cp .env.example .env    # VITE_API_URL + VITE_WHATSAPP_NUMBER (set the real WhatsApp number!)
npm run dev              # http://localhost:5173
```
Fetches live categories/products from the backend. Each product shows its available
sizes as pills (out-of-stock sizes are struck through and unselectable) with the
selected size's price — discounted price shown with the original struck through, if
set. "Order via WhatsApp" logs an inquiry server-side for that size, then opens a
wa.me link pre-filled with the product name, size, and price — no cart/checkout,
matching the proposal's goal of keeping WhatsApp as the actual ordering channel.

## Notes
- Frontend and admin are separate Vite apps so the admin bundle (and its auth-gated
  routes) never ships to public visitors.
- The backend exposes `/api/products`, `/api/categories`, `/api/auth`, documented
  inline in `backend/src/routes/`. Product/category writes require a JWT from
  `POST /api/auth/login`.
- Set `VITE_WHATSAPP_NUMBER` in `frontend/.env` to Take n Go Confectionery's real
  WhatsApp number before going live — it currently falls back to a placeholder.
