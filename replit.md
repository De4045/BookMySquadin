# Book My Squad

India's premium wedding & event planning marketplace connecting couples with top-tier vendors and venues.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/wedding-platform run dev` — run the frontend (reads PORT from env)
- `pnpm run typecheck` — full typecheck across all packages
- Admin login: `admin@dreamweddinghub.com` / `DreamWedding@2025`
- Session cookie name: `bms_sid`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind v4, Framer Motion, GSAP 3.15 + Lenis 1.3.23, wouter routing
- API: Express 5 on port 8080
- Data: In-memory stores (no DB yet — vendors/venues loaded from Excel files)
- Fonts: Cinzel, Cormorant Garamond, Playfair Display, Poppins, Inter, Manrope
- Theme: dark luxury — `#080604` bg, `#d4af37` gold primary

## Where things live

- `artifacts/wedding-platform/src/` — React frontend
  - `components/BookingModal.tsx` — 4-step booking flow (package → event → contact → advance payment)
  - `components/VendorDetailModal.tsx` — vendor side panel with "Book Now" + quick enquiry
  - `components/VenueDetailModal.tsx` — venue side panel with availability calendar
  - `components/MobileBottomNav.tsx` — mobile sticky nav (5 tabs, gold indicator)
  - `pages/portal/AdminPortal.tsx` — admin dashboard (Overview, Bookings, Enquiries, Users, Payments, Saved)
  - `pages/portal/Profile.tsx` — user profile (Account, Bookings, Enquiries, Saved, Membership)
- `artifacts/api-server/src/routes/` — Express routes
  - `bookings.ts` — POST /api/bookings, GET /api/bookings (admin), GET /api/bookings/my, PATCH /api/bookings/:id/status
  - `enquiry.ts` — vendor/venue/contact/listing enquiries
  - `venues.ts` — venue listing + availability + enquiries
  - `vendors.ts` — vendor listing from Excel
  - `payments.ts` — subscription management
  - `auth.ts` — register/login/logout/me

## Architecture decisions

- All data is in-memory (no DB). Vendors and venues are loaded from Excel files at startup via `lib/excel-loader`.
- BookingModal is a 4-step overlay that renders on top of VendorDetailModal using z-index layering (z-[61] vs z-50).
- Packages are defined statically per vendor category (6 categories × 3 tiers). Prices are illustrative but realistic for the Indian wedding market.
- Admin auth uses session middleware (`requireAdmin`); no JWT. Session stored in express-session (in-memory).
- The `BASE_URL` pattern `import.meta.env.BASE_URL?.replace(/\/$/, "") || ""` is used for all API calls across the frontend.

## Product

- Browse 436+ venues and 255+ vendors across India
- Vendor/venue detail modals with availability calendar
- 4-step booking flow: package selection → event details + optional consultation scheduling → contact info → advance payment (₹2,000 refundable)
- Quick enquiry form for casual leads
- Admin portal: booking management, enquiry inbox, user management, payment stats, GST config
- User profile: my bookings, my enquiries, shortlist, membership

## User preferences

- Dark luxury aesthetic — never use light backgrounds or generic UI
- Font hierarchy: Cinzel (labels/UI), Cormorant Garamond (headings/display), Manrope (body), Poppins (general sans)
- Do NOT use `whileInView` with GSAP/Lenis — use the `useScrollAnimation` hook instead
- Do NOT import React explicitly in new files
- Do NOT use `ease: [array]` in Framer Motion variants (breaks TS)
- BASE_URL pattern must be used for all fetch calls — never hardcode `/api/...`

## Gotchas

- `requireAuth` GET /api/bookings/my — user must be logged in; POST /api/bookings works without auth (captures userId if available)
- The splash screen runs for ~3.3s; screenshot tools always catch it — the app itself is fine
- GST verification works in format-only mode by default; add `MASTERS_INDIA_API_KEY` secret to enable live status checks
- Rate limiter may warn about X-Forwarded-For — benign, not blocking

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
