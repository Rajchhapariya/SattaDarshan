# Contributing to SattaDarshan

Thank you for your interest in contributing to **SattaDarshan**!

SattaDarshan is an independent, non-partisan civic and legislative information platform for Indian democracy. Our mission is to provide accurate, transparent, and structured political data for citizens, researchers, journalists, and students.

To maintain the credibility, performance, and legal integrity of the platform, all contributors are expected to follow the guidelines outlined below.

---

## 1. Core Principles & Philosophy

### Strict Non-Partisanship
- SattaDarshan does not endorse, rank, judge, or rate political parties, leaders, or policies.
- Presentation must remain objective, descriptive, factual, and neutral at all times.
- Avoid loaded adjectives, subjective commentary, partisan coloring, or sensationalist headlines.

### Zero Data Fabrication
- Never invent, estimate, extrapolate, or approximate political facts, seat numbers, or portfolio assignments.
- Every claim must be supported by an **authoritative, published primary source** (e.g., *Digital Sansad*, *Election Commission of India*, Official State Government Gazettes, or *MyGov India*).
- An unverified or approximate record is significantly worse than an empty state.

### Preserve Source Attribution & Provenance
- All political records must retain their provenance fields: `source`, `sourceUrl`, `sourceDate`, and `lastVerifiedAt`.
- If introducing or modifying data, always cite the exact official URL and gazette/notification reference.

### Scoped & Minimal Changes (Core Agent Rule)
- Prefer the **smallest possible scoped edit** that solves an issue.
- Do not refactor unrelated modules, rewrite functioning components, rename stable routes, or overhaul design systems.
- Preserve the existing civic **light-mode-only UI** design system.

---

## 2. Development Setup

### Prerequisites
- **Node.js:** `>= 18.0.0` (LTS recommended)
- **MongoDB:** MongoDB 6.0+ local instance or a free MongoDB Atlas cluster
- **npm** package manager

### Getting Started

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SattaDarshan.git
   cd SattaDarshan
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the provided `.env.example` template:
   ```bash
   cp .env.example .env.local
   ```
   Add your MongoDB connection string in `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/sattadarshan?retryWrites=true&w=majority
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   *(Never commit `.env.local` or any sensitive credentials to git!)*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be running at [http://localhost:3000](http://localhost:3000).

---

## 3. Running Diagnostics & Tests

Before submitting any Pull Request, ensure that all automated checks pass locally with **zero errors and zero warnings**:

```bash
# 1. Run ESLint across application code
npm run lint

# 2. Run TypeScript compiler type-check
npx tsc --noEmit

# 3. Compile the production Next.js build
npm run build
```

If you are modifying data helpers, you can also run the non-destructive data auditor:
```bash
npm run audit:data
```

---

## 4. Pull Request Workflow

1. **Create a Feature Branch:**
   ```bash
   git checkout -b fix/constituency-spelling
   # or
   git checkout -b feat/export-factsheet
   ```

2. **Make Small, Focused Commits:**
   - Keep commits atomic and descriptive.
   - Follow standard conventional commit prefixes:
     - `feat:` New user-facing feature or enhancement
     - `fix:` Bug fix or data correction
     - `docs:` Documentation improvements
     - `perf:` Performance optimization
     - `test:` Test suites or verification scripts

3. **Pre-Commit Verification:**
   - Pre-commit hooks (`husky` + `lint-staged`) automatically run on staged files to ensure TypeScript and ESLint compliance before committing.

4. **Submit a Pull Request:**
   - Fill out the PR description with:
     - Clear description of the change
     - Reference to the relevant GitHub Issue (e.g. `Fixes #12`)
     - For data updates: Link to authoritative primary source (ECI, Sansad, Gazette)
     - Screenshots for any visual UI additions

---

## 5. Coding & Architectural Guidelines

### UI & Styling Standards
- **Vanilla CSS / Tailwind:** Styles use tailored civic design tokens.
- **Color Discipline:** Use color sparingly to convey institutional categorization (e.g. alliance color-coding), never to create visual bias or sensationalism.
- **Light-Mode Only:** SattaDarshan is engineered as a clean, institutional light-mode civic reference. Do not inject dark-mode toggles or uncoordinated theme overrides.
- **Accessibility:** All dialogs, menus, and tables must support standard keyboard navigation (`Escape`, arrow keys, `Tab`) and ARIA labels.

### API & Data Fetching
- **Defensive Null Handling:** Political positions can be vacant (e.g. vacant parliamentary seats, caretaker ministries). Never assume optional fields exist.
- **Lean Projections:** Always use `.select(...)` and `.lean()` for read queries to prevent overfetching.
- **No Unsanitized Error Dumps:** Never expose database error objects, MongoDB connection strings, internal stack traces, or server file paths to the user or API client.

### Security & Privacy Rules
- **No Credentials in Git:** `.gitignore` excludes all `.env*` variants. Never hardcode API keys, tokens, or database passwords in scripts or components.
- **Contact & Corrections Privacy:** Submissions via `/contact` or `/corrections` are handled strictly server-side and forwarded to Google Apps Script. They must **never** be logged with PII or stored in public MongoDB collections.
- **External Media:** Any external images must be proxied via `/api/media/avatar` to prevent SSRF and MIME-type smuggling.

---

## 6. Reporting Issues

- **Data Inaccuracies:** Please use the [Data Inaccuracy Report template](https://github.com/Rajchhapariya/SattaDarshan/issues/new?template=data_inaccuracy.yml) with required official gazette or Sansad links.
- **Security Vulnerabilities:** Please do **NOT** file public issues for security vulnerabilities. Send security reports privately through the [Contact Form](https://satta-darshan-7jgo.vercel.app/contact) or directly to the repository maintainers.

Thank you for helping keep SattaDarshan accurate, fast, and accessible for everyone!
