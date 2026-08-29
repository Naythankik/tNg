# Confectionery MVP

E-commerce/catalog MVP for a confectionery business. See `confectionery_mvp_proposal.md`
(also in Downloads) for the full write-up. Three apps live side by side here:

```
confectionery-mvp/
├── frontend/   # Customer-facing catalog — React + Vite + Tailwind
├── admin/      # Admin dashboard — React + Vite + Tailwind
└── backend/    # REST API — Node/Express + MongoDB (Mongoose) + Cloudinary
```

## Getting started

### Backend
```bash
cd backend
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, Cloudinary keys
npm run dev             # starts the API on http://localhost:5000
npm run seed:admin -- owner@example.com somePassword123   # create the first admin login
```

### Frontend (customer catalog)
```bash
cd frontend
npm run dev             # http://localhost:5173
```

### Admin dashboard
```bash
cd admin
npm run dev             # Vite will pick the next free port, e.g. http://localhost:5174
```

## Notes
- Frontend and admin are separate Vite apps so the admin bundle (and its auth-gated
  routes) never ships to public visitors.
- The backend exposes `/api/products`, `/api/categories`, `/api/auth`, all documented
  inline in `backend/src/routes/`. Product/category writes require a JWT from
  `POST /api/auth/login`.
- "Order via WhatsApp" is a client-side link builder (`frontend/src/utils/whatsapp.js`) —
  no cart/checkout, matching the proposal's goal of keeping WhatsApp as the actual
  ordering channel. Each click also logs an `OrderInquiry` server-side for conversion
  tracking (`POST /api/products/:id/inquiries`).
