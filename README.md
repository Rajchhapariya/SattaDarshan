# SattaDarshan

**Sovereign Political Intelligence Ledger**

SattaDarshan is a high-precision, verified legislative data platform tracking the Indian parliamentary matrix. It aggregates, normalizes, and presents comprehensive records of Indian politicians, political parties, state assemblies, and parliamentary chambers (Lok Sabha & Rajya Sabha).

---

## 🏛️ Features

- **Parliamentary Directory:** Verified data for both Lok Sabha and Rajya Sabha members, updated regularly from official government portals (`sansad.in`).
- **Leadership Tracking:** Dedicated filters for Prime Minister, Chief Ministers, Cabinet Ministers, Governors, and prominent MLAs.
- **Geospatial Visualization:** Interactive map of India highlighting political states and constituencies.
- **Deep Politician Profiles:** Rich dossier pages for individual politicians including their term dates, party affiliations, contact details, and historical data.
- **Robust Data Pipeline:** Custom-built TypeScript scrapers powered by Puppeteer and Wikipedia APIs to securely fetch, validate, and normalize complex political records.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router) & React
- **Styling:** Tailwind CSS & Radix UI (Shadcn-like components)
- **Database:** MongoDB & Mongoose
- **Data Ingestion:** Puppeteer, Cheerio, fetch APIs
- **Deployment:** Vercel Ready

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- A running MongoDB cluster (e.g., MongoDB Atlas)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-repo/sattadarshan.git
cd sattadarshan
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/sattadarshan?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Data Synchronization
The platform relies on external data sources for its ledgers. You can seed the local database using the custom built pipelines:
```bash
# Seed the core states, parties, and basic political structure
npm run seed

# Specifically synchronize all current Lok Sabha & Rajya Sabha members from official sources
npm run sync:parliament
```

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📦 Deployment (Vercel)

SattaDarshan is optimized for zero-config Vercel deployment.
1. Push your repository to GitHub.
2. Import the project into your Vercel dashboard.
3. Add the `MONGODB_URI` to your Vercel Environment Variables.
4. Click **Deploy**. Vercel will automatically run `npm run build` and provision your application on a `.vercel.app` domain.

## 🛡️ Data Integrity & SEO
- **Data Deduplication:** Scrapers are equipped with normalization logic to catch name formatting discrepancies (e.g., merging "Shri Narendra Modi" and "Narendra Modi").
- **SEO Ready:** Fully configured with `robots.txt`, dynamic `sitemap.ts`, and comprehensive OpenGraph / Twitter metadata tags out of the box.
