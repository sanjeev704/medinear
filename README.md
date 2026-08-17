# MediNear — Setup Guide

## Folder structure

```
medinear/
├── frontend/                    React app (customer + owner + admin UI)
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx              → all routes
│       ├── index.css            → global styles (design tokens)
│       ├── styles/tokens.css    → colors, radii, fonts (from your design doc)
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Badge.jsx        → stock status pills
│       │   ├── StatTile.jsx
│       │   └── PharmacyMap.jsx  → Leaflet map with 5km radius circle
│       ├── data/mockData.js     → sample pharmacies + medicines (swap for API calls)
│       ├── utils/distance.js    → haversine 5km radius filtering
│       └── pages/
│           ├── Home.jsx
│           ├── FindMedicine.jsx     → customer search + price comparison + map
│           ├── PharmacyProfile.jsx
│           ├── SignIn.jsx
│           ├── RegisterPharmacy.jsx
│           ├── OwnerDashboard.jsx
│           ├── Inventory.jsx        → owner: add/edit/delete stock
│           └── AdminConsole.jsx     → approve/reject pharmacy applications
│
└── backend/                     Node + Express API
    ├── server.js
    ├── models/
    │   ├── Pharmacy.js          → lat/lng, status (pending/approved/rejected)
    │   └── Medicine.js          → references a Pharmacy
    ├── routes/
    │   ├── pharmacies.js        → register, list, admin approve/reject
    │   └── medicines.js         → CRUD + /search (5km radius, cheapest first)
    └── utils/geo.js             → haversine distance calculation
```

## How the pages map to what you asked for

- **Customer section**: Home, Find Medicine (search + compare prices within 5km + map), Pharmacy Profile
- **Owner section**: Sign In, Register Pharmacy, Owner Dashboard, Inventory
- **Admin**: Admin Console (approve/reject pharmacy applications)
- **Map**: `PharmacyMap.jsx` uses **Leaflet + OpenStreetMap** — free, no API key needed (Google Maps needs a billing-enabled API key, which is extra setup you don't need for a hackathon).
- **5km price comparison**: `utils/distance.js` (frontend, using mock data) and `routes/medicines.js` → `/api/medicines/search` (backend, using MongoDB data) both use the haversine formula to filter pharmacies within radius and sort by price.

## Step 1 — Install requirements
- Install [Node.js](https://nodejs.org) (LTS version).
- Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) OR use free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## Step 2 — Open the project
1. Unzip `medinear.zip`.
2. Open the `medinear` folder in VS Code.

## Step 3 — Run the backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Runs at `http://localhost:5000`.

## Step 4 — Run the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

## Step 5 — Try it
The frontend currently runs on **mock data** (`src/data/mockData.js`) so you can see every
page working immediately, with no backend setup needed. Visit:
- `/` — Home
- `/find-medicine` — search "Paracetamol" to see price comparison + map
- `/owner` and `/owner/inventory` — owner dashboard
- `/admin` — admin console
- `/register-pharmacy`, `/sign-in`

## Step 6 — Connect real data (when ready)
Replace the mock data imports in the page files with `axios` calls to your backend, e.g. in
`FindMedicine.jsx`:
```js
const res = await axios.get('http://localhost:5000/api/medicines/search', {
  params: { name: query, lat: location.lat, lng: location.lng, radiusKm: 5 }
})
```
Add pharmacies via POST to `/api/pharmacies` (starts as "pending" until an admin approves it
through `PATCH /api/pharmacies/:id/status`).

## Deploying it (GitHub → live website)

See **`DEPLOYMENT.md`** for the full step-by-step: push to GitHub, host the
backend on Render, host the frontend on Vercel, and connect a free MongoDB
Atlas database. Every `git push` after that auto-redeploys both.

## Next steps to build on
- Real authentication (JWT / sessions) for owner and admin login — currently Sign In is UI-only.
- Use the browser's Geolocation API for "Near me" instead of the fixed default location.
- Licence document upload/storage (S3, Cloudinary, or local disk) for pharmacy registration.
