# SattaDarshan — सत्ता दर्शन
> India's Political Transparency Platform

A full-stack Next.js 14 web application to track Indian politicians, political parties, state governments, and parliament members.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env.local` with your credentials:
- **MongoDB Atlas** — free at [mongodb.com/atlas](https://mongodb.com/atlas)
- **NextAuth Secret** — generate with: `openssl rand -base64 32`
- **NewsData.io** — free at [newsdata.io](https://newsdata.io)
- **Upstash Redis** — free at [upstash.com](https://upstash.com)

### 3. Add RUPP Data
Place `rupps_india.json` in the project root (extracted from the ECI PDF).

Format expected:
```json
[
  { "name": "Party Name", "status": "Active", "headquartersAddress": "...", "pincode": "..." }
]
```

### 4. Seed the Database
```bash
npm run seed
```
This runs all 5 seed scripts:
- `seed-admin` — Creates admin user
- `seed-states` — All 36 states & UTs
- `seed-parties` — 15 major parties
- `seed-politicians` — 10 key leaders
- `seed-rupps` — All RUPPs from JSON

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deployment (Vercel)
```bash
npm i -g vercel
vercel --prod
```
Add all `.env.local` variables in Vercel dashboard.
Project auto-deploys to **Mumbai (bom1)** region for low India latency.

---

## Project Structure
```
sattadarshan/
├── app/                    # Next.js 14 App Router
│   ├── api/                # REST API routes
│   ├── admin/              # CMS (add manually - see below)
│   ├── politicians/        # Browse + [slug] detail
│   ├── parties/            # Browse + [slug] detail
│   ├── states/             # All 36 + [state] detail
│   └── parliament/         # Lok Sabha + Rajya Sabha
├── components/             # React components
│   ├── ui/                 # Badge, Button, SearchBar, Pagination
│   ├── layout/             # Navbar, Footer
│   ├── home/               # Hero, Stats, Featured sections
│   └── politician/         # PoliticianCard, NewsSection
├── lib/                    # db, redis, news, utils
├── models/                 # Mongoose schemas
├── scripts/                # Seed scripts
├── types/                  # TypeScript interfaces
└── rupps_india.json        # Add manually from PDF
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/politicians` | List politicians (filter: q, state, party, role, chamber, page) |
| GET | `/api/politicians/:slug` | Politician detail |
| POST | `/api/politicians` | Create politician |
| PUT | `/api/politicians/:slug` | Update politician |
| DELETE | `/api/politicians/:slug` | Delete politician |
| GET | `/api/parties` | List parties (filter: tier, q, state) |
| GET | `/api/parties/:slug` | Party detail + leaders |
| GET | `/api/states` | All states |
| GET | `/api/news/:politician` | Latest news for politician |
| GET | `/api/stats` | Dashboard stats |

---

Built with ❤️ for political transparency in India 🇮🇳
