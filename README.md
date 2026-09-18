# SattaDarshan

**Independent Civic, Political & Legislative Information Platform for India**

SattaDarshan is an independent, non-government civic data and research platform dedicated to aggregating, structuring, and visualizing publicly available political, legislative, and electoral information across India. The platform tracks members of the 18th Lok Sabha, Rajya Sabha, national and state political parties, Chief Ministers, Union Council of Ministers, and all 36 States and Union Territories.

> [!IMPORTANT]
> **Independent Civic Platform Notice**
> SattaDarshan is strictly an independent, private research and informational project. It is **not** an official government portal, is **not** affiliated with, authorized by, or certified by the Government of India, the Parliament of India (*Sansad*), the Election Commission of India (ECI), or any State or Union Territory Government. For statutory administrative filings, official gazettes, legal proceedings, or Right to Information (RTI) applications, citizens must consult official government portals directly.

---

## Table of Contents

- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Data & Provenance](#data--provenance)
- [SEO, GEO & AI Discoverability](#seo-geo--ai-discoverability)
- [3D Parliamentary Chamber Visualization](#3d-parliamentary-chamber-visualization)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Data & Database Notes](#data--database-notes)
- [Contact & Editorial Corrections](#contact--editorial-corrections)
- [Security & Privacy](#security--privacy)
- [Legal & Disclaimers](#legal--disclaimers)
- [Development Guidelines](#development-guidelines)
- [Available Scripts](#available-scripts)
- [License](#license)

---

## Core Features

- **Representatives & Leadership Directory:** Comprehensive public directory of Indian parliamentarians and leaders (846 verified profiles) with role filtering (Prime Minister, Cabinet Ministers, Chief Ministers, Lok Sabha MPs, Rajya Sabha MPs, MLAs), party affiliation, state, constituency, declared assets, educational qualifications, executive portfolios, and term dates.
- **3D Parliamentary Chamber Visualization:** Interactive 3D WebGL semicircular amphitheatre rendering both the 543-seat Lok Sabha and the 245-seat Rajya Sabha. Features alliance-based color-coding (NDA, INDIA, Others), click-to-inspect seat details, camera angle presets, real-time MP search highlighting, and deferred client-side loading.
- **Interactive Geospatial India Map:** Vector-based SVG map of India allowing users to hover and click through 28 States and 8 Union Territories to inspect ruling parties, Chief Ministers, and parliamentary seat shares.
- **Political Party Registries:** Directory of 100+ recognized national, state, and un-recognized registered parties tracking parliamentary seat tallies, alliances (NDA, INDIA, Independent), leadership, headquarters, and member delegations.
- **State & Union Territory Jurisdictions:** Governance dashboards for all 36 States and UTs detailing current Chief Ministers, ruling parties/coalitions, Assembly strength, Lok Sabha representation, and regional classification.
- **Side-by-Side Representative Comparison (`/compare`):** Multi-factor comparative tool allowing citizens and researchers to evaluate any two leaders across executive office, chamber, educational background, declared assets, constituency mandate, and serving status with live URL bookmarking and position swapping.
- **Intelligent Multi-Token Search:** Fast, keyboard-navigable search modal (`Ctrl+K` / `Cmd+K`) and directory filters supporting multi-attribute queries (name, constituency, state, party) and automatic parliamentary inverted-name normalization (`LastName, Title FirstName` to natural name matching) with ReDoS-safe regex escaping.
- **Civic Correction Intake Pipeline (`/corrections`):** Public error-reporting workflow allowing users to suggest factual updates, term completions, or photo fixes. Reports are sent directly to a private editorial spreadsheet via a secure Google Apps Script bridge without writing to MongoDB.
- **Editorial Contact System (`/contact`):** Direct communication desk for research inquiries, feedback, and copyright attribution notices.
- **Mobile-First Responsive Design:** Clean, dignified civic light-mode aesthetic optimized across mobile, tablet, and desktop viewports.

---

## Technology Stack

The platform is built using modern, production-tested open-source libraries:

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) 16 (App Router, Server Components, Route Handlers) |
| **UI Library** | [React](https://react.dev/) 19 & [React DOM](https://react.dev/) 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) 5 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) 3, `tailwindcss-animate`, `clsx`, `tailwind-merge` |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) (Avatar, Dialog, Dropdown Menu, Select, Separator, Slot, Tabs, Tooltip), [Lucide React](https://lucide.dev/) (Icons) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) 6 & [Mongoose](https://mongoosejs.com/) 8 |
| **3D Engine** | [Three.js](https://threejs.org/) (WebGL interactive parliamentary amphitheatre) |
| **Geospatial & Charts** | [d3-geo](https://d3js.org/d3-geo), [react-simple-maps](https://www.react-simple-maps.io/), [Recharts](https://recharts.org/) |
| **Search & Utilities** | [Fuse.js](https://www.fusejs.io/) (Fuzzy search), [Sharp](https://sharp.pixelplumbing.com/) (Image handling), `i18next` & `react-i18next` |
| **Runtime & Tooling** | Node.js (>= 18.0.0), [ESLint](https://eslint.org/), [tsx](https://github.com/privatenumber/tsx) |

---

## Architecture

```
                                    +------------------------------------------+
                                    |               Browser / Client           |
                                    +------------------------------------------+
                                                         |
                                                         v
                                    +------------------------------------------+
                                    |        Next.js 16 App Router (SSR)       |
                                    +------------------------------------------+
                                      |                    |                 |
                         +------------+                    |                 +-------------+
                         v                                 v                               v
            +-------------------------+      +-------------------------+      +-------------------------+
            |    Server Components    |      |    Route Handlers (API) |      |   Three.js 3D Chamber   |
            | (Pre-rendered Pages)    |      | (JSON, Avatar, OG, etc.)|      | (Dynamically Deferred)  |
            +-------------------------+      +-------------------------+      +-------------------------+
                         |                                 |
                         +------------+      +-------------+
                                      |      |
                                      v      v
                        +-----------------------------------+
                        | React cache() Deduplicated Layer  |
                        |      (lib/server/queries.ts)      |
                        +-----------------------------------+
                                          |
                                          v
                        +-----------------------------------+
                        |       MongoDB / Mongoose ODM      |
                        | (Politician, Party, State Models) |
                        +-----------------------------------+
```

- **Frontend & Pages:** Server Components pre-render page shells, legal notices, and structured data into static or edge-cached HTML. Heavy interactive components (e.g., Three.js 3D chamber) are dynamically deferred using `next/dynamic` with animated civic loading skeletons to ensure fast First Contentful Paint (FCP).
- **API Routes (`app/api/*`):** REST endpoints serving paginated representatives, parties, states, real-time search, live parliament seating, media proxying, dynamic OpenGraph images, and cache invalidation.
- **Database Layer (`models/*`, `lib/db.ts`):** Mongoose models for `Politician`, `Party`, and `State`. Connection pooling uses a global cache to reuse connections across serverless invocations.
- **Server Cache Layer (`lib/server/queries.ts`):** React `cache()`-wrapped database queries ensure that concurrent reads within a single render pass (e.g., between `generateMetadata` and `Page`) are executed exactly once.
- **External Integration (`lib/googleSheets.ts`):** Unidirectional server-side forwarding of contact messages and correction reports to a private Google Apps Script Web App. Submissions are never saved to MongoDB.

---

## Project Structure

```
sattadarshan/
├── app/                              # Next.js App Router root
│   ├── api/                          # Public and administrative API endpoints
│   │   ├── contact/route.ts          # Contact message intake (Google Sheets forwarder)
│   │   ├── corrections/route.ts      # Error report intake (Google Sheets forwarder)
│   │   ├── media/avatar/route.ts     # Secure HTTPS raster image proxy
│   │   ├── og/[type]/[slug]/         # Dynamic Open Graph image generation (@vercel/og)
│   │   ├── parliament/seats/route.ts # Parliament chamber seating data & alliance tallies
│   │   ├── parties/                  # Party list & detail API
│   │   ├── politicians/              # Representative list & detail API
│   │   ├── revalidate/route.ts       # On-demand cache invalidation endpoint
│   │   ├── search/route.ts           # Global search API (ReDoS-protected)
│   │   ├── states/                   # States and UTs API
│   │   └── stats/route.ts            # High-level entity counters
│   ├── compare/                      # Side-by-side politician comparison page
│   ├── contact/                      # Contact and editorial inquiries page
│   ├── corrections/                  # Data inaccuracy reporting page
│   ├── disclaimer/                   # Non-government civic disclaimer
│   ├── map/                          # Full-page interactive India map
│   ├── methodology/                  # Sourcing & data integrity methodology
│   ├── parliament/                   # Lok Sabha and Rajya Sabha chamber views
│   ├── parties/                      # Political parties directory & profiles
│   ├── politicians/                  # Representatives directory & profiles
│   ├── privacy/                      # Privacy policy
│   ├── states/                       # States & Union Territories dashboard
│   ├── terms/                        # Terms of service
│   ├── error.tsx                     # Global error boundary (generic civic notices)
│   ├── global-error.tsx              # Root application error boundary
│   ├── layout.tsx                    # Root layout, fonts, navigation, footer, JsonLd
│   ├── not-found.tsx                 # Dignified civic 404 page
│   ├── robots.ts                     # Search engine & AI bot crawler rules
│   └── sitemap.ts                    # Dynamic XML sitemap generator (~997 URLs)
├── components/                       # Reusable React components
│   ├── common/                       # Modals, accuracy notices, stats cards
│   ├── home/                         # IndiaMap, FeaturedPoliticians, HomeChamberWrapper
│   ├── layout/                       # Navbar, Footer, GlobalSearch modal
│   ├── parliament/                   # ThreeParliamentChamber (3D WebGL engine)
│   ├── politician/                   # PoliticianCard, PoliticianTable, CivicAvatar
│   ├── seo/                          # JsonLd structured data generator
│   └── ui/                           # Radix UI primitives & custom selects
├── lib/                              # Core utilities and helpers
│   ├── db.ts                         # Mongoose connection with connection caching
│   ├── googleSheets.ts               # Google Apps Script Web App forwarder
│   ├── server/queries.ts             # React cache()-deduplicated server queries
│   ├── seo/slugs.ts                  # Canonical slug normalization helpers
│   └── utils.ts                      # General utilities (regex escaping, cn)
├── models/                           # Mongoose schemas
│   ├── Politician.ts                 # Leader profiles, offices, and provenance
│   ├── Party.ts                      # Political parties, alliances, seat counts
│   ├── State.ts                      # States/UTs, governance, Assembly & LS seats
│   └── Correction.ts                 # Correction schema definition
├── scripts/                          # Data maintenance and testing utilities
│   ├── audit-db.ts                   # Database integrity & field consistency auditor
│   ├── clean-and-update-data.ts      # Data cleaning and normalization script
│   ├── cache-politician-portraits.ts # Portrait image downloader & local cacher
│   └── test-security.ts              # Automated security regression test harness
├── next.config.mjs                   # Next.js configuration & HTTP security headers
├── package.json                      # Project dependencies and npm scripts
└── tsconfig.json                     # TypeScript configuration
```

---

## Data & Provenance

SattaDarshan aggregates political data from publicly accessible, published records. 

### Sourcing & Verification Principles
- **Public Sources:** Sourced from official legislative sites (`sansad.in`, `loksabhaph.nic.in`), Election Commission of India (ECI) election results, official State Government portals, MyGov India, and verified public domain archives.
- **Provenance Fields:** The `Politician` model supports structured provenance metadata:
  - `source` & `sourceUrl`: The exact published source documentation or official registry.
  - `sourceDate`: The date of the source publication.
  - `lastVerifiedAt`: Timestamp of the most recent editorial verification.
  - `verificationStatus`: Classification of the record (`official`, `verified`, `historical`, `unverified`).
  - `tenureStatus`: Status of the office-holder (`serving`, `former`, `historical`).
- **Dynamic Nature of Political Data:** Political positions, ministerial portfolios, parliamentary seating, and party affiliations can change rapidly due to elections, cabinet reshuffles, resignations, or legal determinations. SattaDarshan displays timestamps and source references, but users requiring statutory certainty must verify facts against current official gazettes.

---

## SEO, GEO & AI Discoverability

SattaDarshan includes a comprehensive technical SEO and Generative Engine Optimization (GEO) implementation designed to facilitate clear understanding by search engines and answer engines (Google, Bing, Perplexity, ChatGPT Search):

- **Dynamic Sitemap (`/sitemap.xml`):** Generates an XML sitemap of approximately ~997 canonical URLs covering all politicians, parties, states/UTs, chambers, and informational routes with lean database projections.
- **Bot-Aware Crawler Directives (`/robots.txt`):** Explicit rule sets for `Googlebot`, `Bingbot`, `OAI-SearchBot`, and `PerplexityBot`. Allows access to public pages, OG images, and media assets while protecting private API endpoints (`/api/contact`, `/api/corrections`, `/api/revalidate`, `/api/search`).
- **Structured Data (JSON-LD):** Centralized `<script type="application/ld+json">` engine outputting valid Schema.org definitions:
  - Homepage: `WebSite` (with `SearchAction`) & `Organization`
  - Representative Profiles: `ProfilePage` with mainEntity `Person` (jobTitle, memberOf, hasOccupation, socialLinks, image) & `BreadcrumbList`
  - Party Pages: `PoliticalParty` & `BreadcrumbList`
  - State Pages: `AdministrativeArea` (containedInPlace: India) & `BreadcrumbList`
  - Parliament Pages: `WebPage` with `GovernmentOrganization` (`Lok Sabha` / `Rajya Sabha`)
- **Script-Breakout Protection:** Serialized JSON-LD strings automatically escape `<` characters to `\u003c` to eliminate HTML script-breakout vulnerabilities.
- **Canonical Slug Normalization (`lib/seo/slugs.ts`):** Canonical state and party slug resolvers eliminate URL-encoding discrepancies and broken internal links.

---

## 3D Parliamentary Chamber Visualization

The platform features an interactive 3D WebGL reconstruction of the Indian parliamentary floor plan built with Three.js:

- **Chamber Support:** Fully supports both the **18th Lok Sabha** (543 constituency seats) and the **Rajya Sabha** (245 seats).
- **Semicircular Amphitheatre Geometry:** Seats are calculated using Archimedean polar coordinates distributed radially across tiered benches, matching the architecture of the Indian Parliament.
- **Alliance Color-Coding:** Real-time color classification:
  - **NDA:** Saffron (`#F59E0B`)
  - **INDIA:** Democratic Blue (`#2563EB`)
  - **Others / Regional:** Slate Emerald (`#10B981`)
- **Interactivity:**
  - **Orbit Controls:** Smooth rotation, panning, and zoom via mouse or touch gestures.
  - **Seat Inspection:** Hovering or clicking on an individual seat displays an inspector card showing the MP's name, photograph, seat number, constituency, state, and party.
  - **Camera View Presets:** Instant camera transitions between "Overview", "Speaker Perspective", "Treasury Benches", and "Opposition Benches".
  - **Search & Filter Highlighting:** Filtering by name or party immediately illuminates matching seats while dimming non-matching seats.
- **Performance Optimization:** The 3D chamber is lazily loaded via `next/dynamic` with `ssr: false` behind an animated civic skeleton wrapper, ensuring that the heavy 3D rendering library does not block page load or time-to-interactive.

---

## Getting Started

### Prerequisites
- **Node.js:** `>= 18.0.0` (LTS recommended)
- **MongoDB:** A running MongoDB instance or cluster (MongoDB 6+ or MongoDB Atlas)
- **npm** or compatible package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Rajchhapariya/SattaDarshan.git
cd sattadarshan
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the provided `.env.example` template to `.env.local`:
```bash
cp .env.example .env.local
```
Or create a `.env.local` file in the project root:
```env
# Required: MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/sattadarshan?retryWrites=true&w=majority

# Optional: Application Base URL for Canonicals & Sitemaps (Default: https://satta-darshan-7jgo.vercel.app)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional (Recommended for data ingestion): Secret token for on-demand cache revalidation
REVALIDATE_SECRET=your_secure_random_revalidation_key

# Optional: Google Apps Script Web App URL for contact/correction submissions
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
APPS_SCRIPT_SECRET=your_optional_apps_script_token
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```

### 6. Start the Production Server
```bash
npm run start
```

---

## Environment Variables

| Variable | Type | Scope | Description |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | **Required** | Server-only | MongoDB connection URI with authentication credentials. Never exposed to the client. |
| `NEXT_PUBLIC_APP_URL` | Optional | Public (Client & Server) | Canonical URL used in meta tags, sitemap, and robots.txt. Defaults to production domain if unset. |
| `REVALIDATE_SECRET` | Optional | Server-only | Secret token required in the `x-revalidate-secret` header to call `/api/revalidate`. |
| `GOOGLE_APPS_SCRIPT_URL` | Optional | Server-only | Endpoint URL of the Google Apps Script Web App that receives contact and correction reports. |
| `APPS_SCRIPT_SECRET` | Optional | Server-only | Token passed server-side to the Google Apps Script Web App to verify origin. |

---

## Data & Database Notes

- **Database Engine:** MongoDB accessed via Mongoose 8 with schema validation and strict index definitions.
- **Connection Caching:** Database connections are cached on `global.__mongoose` to avoid socket exhaustion across Next.js re-renders and serverless function calls.
- **Lean Queries:** Public queries utilize `.lean()` and explicit field selection (`.select(...)`) to avoid transferring unnecessary internal properties.
- **Deduplicated Queries:** Server component data fetching leverages React `cache()` in `lib/server/queries.ts` to deduplicate identical reads across a single render tree.
- **Safe Maintenance Scripts:**
  - `npm run audit:data`: Non-destructive auditor that inspects all MongoDB collections for missing required fields, orphaned records, and duplicate slugs.
  - `npm run sync:data`: Normalization utility that cleans whitespace, standardizes party naming conventions, and populates derived fields.
  - `npm run cache:portraits`: Utility to download and locally cache remote leader portraits to reduce external image dependencies.

---

## Contact & Editorial Corrections

SattaDarshan features a two-way community accuracy pipeline:

1. **Editorial Correction Desk (`/corrections`):**
   - Allows citizens and researchers to submit factual corrections (outdated office, incorrect seat count, broken reference).
   - Server-side validates record types, issue classifications, description lengths, and HTTP/HTTPS source URLs.
   - Protected by an anti-spam honeypot (`website_trap`) and in-memory IP rate limiting (5 submissions per 15-minute window).
2. **Civic Communications Desk (`/contact`):**
   - Intake for general inquiries, feedback, and copyright attribution notices.
   - Enforces 64KB payload bounds, email format validation, and honeypot filtering.
3. **Privacy Architecture:**
   - Submissions are **never** written to MongoDB or stored on local servers.
   - Submissions are forwarded server-to-server to a private Google Sheet via Google Apps Script.
   - Endpoints return safe generic success responses and never echo user PII.

---

## Security & Privacy

The codebase has undergone production security hardening:

- **Zero Stack Trace / Error Leaks:** All API routes and React error boundaries (`app/error.tsx`, `app/global-error.tsx`) return clean, generic user-facing messages on failure. Raw exception messages, MongoDB errors, file paths, and stack traces are strictly hidden in production.
- **Revalidation Hardening (`/api/revalidate`):** Requires the secret exclusively in the `x-revalidate-secret` header (disallows query parameters to prevent log leakage). Compares tokens using `crypto.timingSafeEqual` in constant time.
- **Media Avatar Proxy Hardening (`/api/media/avatar`):** Strictly enforces `https:` protocols, restricts upstream MIME types to safe raster images (`image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/gif`), rejects `image/svg+xml` and HTML to prevent XSS smuggling, enforces a 10MB limit, and injects `X-Content-Type-Options: nosniff`.
- **HTTP Security Headers (`next.config.mjs`):**
  - `X-Powered-By`: Suppressed via `poweredByHeader: false`.
  - `productionBrowserSourceMaps: false`: Prevents public access to unbundled source maps.
  - `Content-Security-Policy`: Tailored directives supporting Next.js, Three.js canvas, and verified image CDNs.
  - `X-Frame-Options: DENY`: Prevents clickjacking and unauthorized iframe embedding.
  - `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.
  - `Referrer-Policy: strict-origin-when-cross-origin`: Restricts referrer data on cross-origin requests.
  - `Strict-Transport-Security (HSTS)`: Enforces HTTPS with preload.
  - `Permissions-Policy`: Restricts camera, microphone, and geolocation APIs.
- **Input Validation & Anti-Abuse:** Query strings and search parameters are length-clamped (e.g., search queries clamped to 80 characters with regex escaping) to prevent ReDoS and memory abuse.
- **Vulnerability Disclosure Policy:** For instructions on responsibly reporting security vulnerabilities, please see our [Security Policy](SECURITY.md).

---

## Legal & Disclaimers

Detailed legal documentation is maintained across dedicated public routes:

- **Disclaimer (`/disclaimer`):** Explains the non-government status of the platform, the educational and research nature of the data, and limitations of liability.
- **Methodology (`/methodology`):** Documents the data collection, normalization, verification, and correction procedures.
- **Privacy Policy (`/privacy`):** Details data handling, session storage usage (disclaimer acknowledgement only), and the private Google Sheets intake architecture.
- **Terms of Service (`/terms`):** Outlines acceptable use, content licensing, and user responsibilities.

---

## Development & Contributing Guidelines

We welcome community contributions, analytical features, and data corrections! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for our setup instructions, PR workflows, and data verification standards.

Contributors and maintainers must adhere to the following principles:

1. **Strict Political Neutrality:** SattaDarshan is non-partisan. Data presentation must remain objective, descriptive, and balanced. Avoid editorializing, partisan commentary, or subjective ratings.
2. **Zero Data Fabrication:** Never invent, extrapolate, or guess political facts, office holders, or seating numbers. Every change must be verified against authoritative public records.
3. **Preserve Provenance:** When updating political records, maintain existing source URLs, verification notes, and historical term dates.
4. **Minimal Scoped Diff:** In accordance with repository rules, avoid broad refactors or global styling changes to solve localized tasks.
5. **Protect Secrets:** Never commit `.env` files, MongoDB credentials, API tokens, or Apps Script URLs. Ensure all local environment variables remain in `.env.local` (protected by `.gitignore`).
6. **Preserve Light-Mode Aesthetic:** SattaDarshan uses a deliberate civic light-mode design system. Do not introduce unvetted theme toggles or dark-mode overrides unless requested.
7. **Maintain Accessibility & Mobile Usability:** All interactive components, dialogs, and tables must support keyboard navigation and remain usable on mobile viewports.
8. **Automated Pre-Commit Validation:** Husky and lint-staged automatically run ESLint (`--max-warnings=0`) and TypeScript compiler checks on staged files before every commit to ensure clean code quality.

---

## Available Scripts

The following scripts are defined in `package.json`:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `http://localhost:3000`. |
| `npm run build` | Compiles the production build with Webpack. |
| `npm run start` | Launches the compiled Next.js production server. |
| `npm run lint` | Runs ESLint across `app/`, `components/`, `lib/`, and `models/`. |
| `npm run audit:data` | Audits MongoDB collections for schema compliance, orphaned references, and duplicate slugs. |
| `npm run sync:data` | Executes the data normalization and cleaning script on the database. |
| `npm run cache:portraits` | Downloads and caches external leader portrait images locally. |

---

## License
 
This project is open source and available under the [MIT License](LICENSE).
 
See the [LICENSE](LICENSE) file for full copyright and permission notices.
