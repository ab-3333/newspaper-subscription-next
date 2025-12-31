# Phase 1 Deliverable — Newspaper Subscription SPA (Next.js App Router)

## Purpose and scope

This document describes the routing structure, component boundaries (Server vs Client Components), rendering and data-fetching strategy, SEO metadata approach, and performance considerations for the newspaper-subscription single-page application. The user journey follows the multi-step subscription process described in the provided specification document.

## 1) Route map and component types

### Route map (current implementation)

The application is implemented using Next.js App Router with the following primary routes:

- `/` — Entry page (subscription landing and call-to-action)
- `/delivery-address` — Delivery address form; triggers distance and edition lookup
- `/configuration` — Subscription configuration (type, delivery frequency, payment interval, start date) and price preview
- `/login` — Simulated login/registration (email + password)
- `/checkout` — Billing address + direct debit payment details + order review
- `/thank-you` — Order confirmation page

### Component types (Server vs Client)

**Root layout**
- `src/app/layout.tsx` should remain a **Server Component** by default.
- Rationale: layout composition, static metadata defaults, and consistent framing are best handled server-side for efficiency and predictable rendering behavior.

**Pages**
All route pages listed above are implemented as **Client Components** (`'use client'`), primarily because:
- They are form-heavy and require immediate client-side validation and interactivity.
- They rely on client-side navigation guards and shared multi-step state (React Context).
- They compute and display dynamic values (e.g., price preview) that update in real time when users change selections.

This design reflects the product requirements where the experience is driven by user input across several steps rather than server-delivered content pages.

## 2) Data-fetching and rendering strategy

This section documents the chosen rendering mode for each route/data need, with rationale focused on usability, performance, and appropriate indexability.

### `/` (Home)
- **Mode:** CSR (Client-side rendering in a Client Component)
- **Rationale:** The page is primarily a UI entry point with a call-to-action; no external data is required at render time.

### `/delivery-address` (Distance and edition lookup)
- **Mode:** CSR (Client Component) with client-triggered data fetching on submit
- **Data needs:** Distance calculation and local edition list.
- **Implementation basis:** The provided API surface includes `getDistanceFromCompanyToDestinationPlz(plz)` and `getLocalVersionsForPlz(plz)`.
- **Rationale:** The distance and edition lookup depends on user-entered postal code; pre-rendering does not help because there is no stable data before input.
- **Operational behavior:** When a postal code is not found in the mock database, the distance calculation resolves to `0` as a fallback.

### `/configuration` (Price preview and configuration)
- **Mode:** CSR (Client Component)
- **Data needs:** Uses the distance and edition data previously fetched on `/delivery-address`, plus local price calculation.
- **Rationale:** Price updates must be immediate as users toggle delivery frequency and payment interval. This is best served by client computation with memoization.

### `/login` (Simulated authentication)
- **Mode:** CSR (Client Component)
- **Rationale:** Authentication is intentionally simulated for this project and stored in client state.

### `/checkout` (Billing and payment details)
- **Mode:** CSR (Client Component)
- **Rationale:** Checkout is a form workflow with conditional UI (billing same as delivery) and validation. Server-side rendering is not required for correctness in the current MVP.

### `/thank-you` (Confirmation)
- **Mode:** CSR (Client Component)
- **Rationale:** The confirmation content is shown after successful client validation and simulated submission. The specification treats this as a final step in the flow rather than a search entry point.

### SEO and performance rationale (high level)
- Indexability is most appropriate for the public entry route (`/`), while transactional pages (login, checkout, thank-you) do not provide standalone search value and should not be indexed.
- Performance is optimized through route-level code splitting and prefetching, and by avoiding unnecessary server work for highly interactive steps.

## 3) SEO metadata plan

### Primary entry page
The primary entry page for SEO is `/` because it is the top-of-funnel landing route and does not depend on user-specific inputs.

### Metadata structure
- Use `export const metadata = { ... }` in `src/app/layout.tsx` for defaults (site-wide title template, base description, Open Graph and Twitter card defaults).
- Use route-level overrides (via `generateMetadata()` where needed) only for routes intended to be indexable (typically `/` only, and optionally `/configuration` if the organization wants a marketing-friendly configurator entry point).

Recommended metadata elements:
- Title and description aligned with “newspaper subscription”, “printed”, “e-paper”, and “web access”.
- Open Graph: title, description, canonical URL, and a social image.
- Twitter: large summary card.

### robots.txt and sitemap
- Provide `public/robots.txt` that allows indexing of `/` and disallows transactional routes such as `/checkout`, `/thank-you`, and `/login`.
- Provide a sitemap via `app/sitemap.ts` (or a static sitemap.xml) listing only the intended public routes.

### Folder structure support
App Router’s nested structure allows:
- A single metadata baseline at the root layout.
- Per-route overrides where required.
- Clear separation between public entry pages and transactional steps.

## 4) Performance considerations

### Route-segment code splitting and prefetching
Next.js performs automatic route-level code splitting, meaning only the JavaScript necessary for the current route is loaded initially. Subsequent steps load on demand, which reduces initial payload compared to bundling the entire flow upfront.

Next.js also prefetches linked routes when they enter the viewport (when using `<Link />`), improving perceived navigation speed in multi-step flows like this one.

### Core Web Vitals planning
Planned optimizations to maintain strong Core Web Vitals include:
- Preloading or prioritizing critical images on the entry route (if any).
- Reserving layout space for sections that change size (e.g., price preview blocks) to prevent layout shift.
- Using `next/font` for font optimization and reducing render-blocking resources.
- Ensuring all images use explicit dimensions via `next/image` to avoid cumulative layout shift.

## 5) Optional bonus (planned enhancements)

### Dynamic social preview (ImageResponse)
A dynamic Open Graph image can be generated using `ImageResponse` (for example, showing subscription type and a sample price) to support richer sharing links for marketing pages.

### Server Action candidate
A suitable Server Action location is order submission from `/checkout`:
- Validate and normalize sensitive fields server-side (e.g., IBAN format).
- Persist order/customer data using the provided mock database functions where applicable.
- Redirect to `/thank-you` after successful submission (server-side redirect).

## Appendix: Data sources used in the flow

- Distance and local editions are obtained via the provided API functions.
- Distance fallback behavior for unknown postal codes is defined in the provided mock database implementation.
- The overall multi-step subscription process is aligned with the provided specification document.

### App Router Structure
```
src/app/
├── layout.tsx                          [Server Component - Root layout]
├── page.tsx                            [Client Component - Home /]
├── (main)/
│   ├── delivery-address/
│   │   └── page.tsx                   [Client Component - Form handling]
│   ├── configuration/
│   │   └── page.tsx                   [Client Component - Live pricing]
│   ├── login/
│   │   └── page.tsx                   [Client Component - Auth simulation]
│   ├── checkout/
│   │   └── page.tsx                   [Client Component - Payment form]
│   └── thank-you/
│       └── page.tsx                   [Client Component - Static confirmation]
├── api/
│   └── (mock handlers for future API routes)
└── globals.css                        [Global styles]
```

