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
  - `components/FloatingWhatsApp.tsx` — global WhatsApp deep-link button (pulse, tooltip, dismiss)
  - `components/ConsultationModal.tsx` — 3-mode modal: Book Consultation / Get Instant Quote / Check Availability
  - `components/TiltCard.tsx` — 3D perspective tilt with glare, wraps any children
  - `pages/EventPortfolio.tsx` — `/events` portfolio hub: 9 case studies, category filter, stats, CTA band
  - `pages/CaseStudy.tsx` — `/events/:slug` full case study: hero, meta, gallery lightbox, timeline, vendor team, testimonial, related
  - `pages/portal/AdminPortal.tsx` — admin dashboard (Overview+recharts, Bookings, Enquiries, Users, Payments, Blog CMS)
  - `pages/portal/Profile.tsx` — user profile (Account, Bookings, Enquiries, Saved, Membership)
  - `pages/portal/VendorPortal.tsx` — vendor dashboard with self-edit (name/phone/city/bio)
  - `data/caseStudies.ts` — 9 case studies: 3 weddings, 2 corporate, 2 birthday, 2 destination
- `artifacts/api-server/src/routes/` — Express routes
  - `bookings.ts` — POST /api/bookings, GET /api/bookings (admin), GET /api/bookings/my, PATCH /api/bookings/:id/status
  - `enquiry.ts` — vendor/venue/contact/listing enquiries
  - `venues.ts` — venue listing + availability + enquiries
  - `vendors.ts` — vendor listing from Excel
  - `payments.ts` — subscription management
  - `auth.ts` — register/login/logout/me, PATCH /api/auth/profile (self-edit)
  - `articles.ts` — GET/POST/DELETE /api/articles (Blog CMS, seeded with 4+ articles)

## Architecture decisions

- All data is in-memory (no DB). Vendors and venues are loaded from Excel files at startup via `lib/excel-loader`.
- BookingModal is a 4-step overlay that renders on top of VendorDetailModal using z-index layering (z-[61] vs z-50).
- Packages are defined statically per vendor category (6 categories × 3 tiers). Prices are illustrative but realistic for the Indian wedding market.
- Admin auth uses session middleware (`requireAdmin`); no JWT. Session stored in express-session (in-memory).
- The `BASE_URL` pattern `import.meta.env.BASE_URL?.replace(/\/$/, "") || ""` is used for all API calls across the frontend.
- ConsultationModal is instantiated in Navbar (global) and in each portfolio page — no prop-drilling context needed.
- FloatingWhatsApp renders globally in App.tsx inside WouterRouter, appears 3.5s after splash completes.
- CaseStudy gallery uses a client-side paginator (4 per page) with a lightbox overlay at z-[9900].

## Product

- Browse 436+ venues and 255+ vendors across India
- Vendor/venue detail modals with availability calendar
- 4-step booking flow: package selection → event details + optional consultation scheduling → contact info → advance payment (₹2,000 refundable)
- Quick enquiry form for casual leads
- Event Portfolio at `/events`: 9 case studies (weddings, corporate, birthday, destination) with category filter
- Case Study pages at `/events/:slug`: full story — budget, theme, gallery, planning timeline, vendor team, testimonial
- Three CTA surfaces: "Book Consultation", "Get Instant Quote", "Check Availability" — all open ConsultationModal
- Floating WhatsApp button: deep-links to WhatsApp with pre-filled message, pulse animation, tooltip
- Sticky Navbar CTA: "Plan Your Dream Event" button (desktop + mobile menu)
- Admin portal: booking management, enquiry inbox, user management, payment stats, GST config, Blog CMS (recharts analytics)
- Blog CMS: admin can create/delete articles, frontend fetches from /api/articles
- Vendor Comparison Tool: add up to 3 vendors from Vendors page, side-by-side modal
- Price Range Filter on Vendors page
- Wedding Checklist at `/checklist`: localStorage-backed with pre-populated tasks by category
- Vendor self-edit: name, phone, city, bio in Vendor Portal
- In-app notifications: bell icon with unread badge, dropdown panel
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
- FloatingWhatsApp has a 3.5s delay before appearing (intentional, post-splash)
- CaseStudy lightbox is at z-[9900]; ConsultationModal is at z-[9800]; FloatingWhatsApp is at z-[9990]

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
