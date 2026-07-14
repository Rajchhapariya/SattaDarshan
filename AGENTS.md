# AGENTS.md

## Purpose
This file guides AI coding agents working on **SattaDarshan**, a political data aggregation and analysis web app. The goal is to let the product evolve safely without rewriting stable parts of the codebase.

## Core rule
**Do not change the whole thing to implement a small request.**

When asked to make a change, prefer the smallest possible scoped edit that solves the request.

## Autonomy rules
Agents should work **autonomously** for all safe, non-destructive tasks and should not keep asking for permission again and again during analysis or planning.

Allowed without repeated permission:
- Read files and inspect code
- Search the repository
- Trace imports, routes, components, and data flow
- Run safe read-only diagnostics and build analysis
- Audit bugs, performance, and architecture
- Coordinate and initialize all relevant custom subagents
- Produce plans, execution blueprints, redesign strategies, and fix lists

Ask for approval only before:
- Editing files
- Applying patches
- Refactoring existing logic
- Renaming files, folders, routes, or exports
- Changing schemas or migrations
- Deleting code
- Installing, removing, or upgrading dependencies
- Running destructive or irreversible commands

If permission has already been granted for a defined phase of work, do not ask again for every small step inside that phase. Proceed autonomously within the approved scope and stop only when:
1. the approved phase is complete,
2. a true blocker is found,
3. a broader change than approved is required.

## Subagent coordination
If custom subagents are available, initialize and use all relevant subagents automatically for their specialties. Do not ignore applicable subagents.

Agents should:
- Detect all applicable custom subagents
- Use them for analysis, debugging, performance review, UI review, and planning
- Combine subagent findings into one clear response
- Report if any subagent failed to load or was blocked by configuration

## Product context
SattaDarshan is a political data platform focused on aggregating, organizing, and presenting political information in a structured way. Typical areas may include:
- Political parties, leaders, constituencies, elections, alliances, and trends
- Data dashboards, filters, search, profiles, and comparison pages
- News or event aggregation with clear source attribution
- Public-facing informational pages plus internal/admin data workflows

## Agent priorities
Follow this order every time:
1. Understand the exact requested change.
2. Identify the smallest surface area affected.
3. Reuse existing components, utilities, schemas, and styles.
4. Preserve current behavior unless the request explicitly asks to modify it.
5. Make changes in a way that is easy to review and easy to roll back.

## Change strategy

### 1) Make minimal diffs
- Touch only files directly related to the task.
- Avoid broad refactors unless they are required to complete the task safely.
- Do not rename files, folders, functions, routes, or database fields unless necessary.
- Do not reformat unrelated files.
- Do not replace an existing pattern with a new architecture just because it seems better.

### 2) Protect existing UI and flows
- Preserve current layouts, spacing, and component behavior unless the request is visual redesign.
- Do not rewrite entire pages to add one card, one filter, one table column, or one API call.
- Keep existing routes, navigation labels, and query parameter behavior stable where possible.
- If a component already exists, extend it instead of creating a parallel version.

### 3) Respect data integrity
- Never change database schema casually.
- If a schema change is unavoidable, make it backward-compatible first.
- Prefer additive changes: new nullable field, new derived property, new optional API response field.
- Never delete or repurpose existing fields without explicit instruction.
- Validate political data carefully; wrong mappings are worse than missing data.

### 4) Preserve source trust
- SattaDarshan deals with political information, so credibility matters.
- Never present inferred or scraped data as confirmed fact without marking source/status.
- Keep source links, timestamps, and update metadata intact.
- If introducing summaries, label them clearly as generated summaries when needed.
- Avoid language that implies endorsement, bias, or certainty where the source does not support it.

### 5) Build for extensibility, not explosion
- New code should fit the existing project structure.
- Prefer composable utilities and small helpers over giant abstractions.
- If adding a new feature area, isolate it cleanly behind its own module, service, or component boundary.
- Avoid creating duplicate fetching logic, duplicate types, or duplicate card variants.

## What to inspect before editing
Before making changes, inspect:
- Relevant page or route
- Related reusable components
- Existing API handlers or server actions
- Data types, validation schemas, and DB models
- Environment variable usage
- Any caching, ISR, cron, scraping, or ingestion dependency touching the same data

## Allowed changes
These are generally safe when scoped correctly:
- Add a new section to an existing page
- Add a filter, sort, badge, chart, or stats card
- Add optional fields to API responses
- Add small reusable UI components matching the current design system
- Improve loading, empty, or error states
- Fix a bug with minimal behavioral impact
- Add logging, guards, validation, and fallback handling

## Changes that require extra caution
Pause and think before doing any of these:
- Rewriting page structure
- Changing route hierarchy
- Replacing data fetching patterns
- Altering DB schema or migrations
- Reworking auth/admin permissions
- Changing scraper or ingestion pipelines
- Editing shared design tokens or global CSS
- Large dependency upgrades

## When a bigger change is actually needed
If the request cannot be done safely with a small patch:
1. Explain why the current structure blocks the requested feature.
2. Propose the smallest viable refactor.
3. Keep refactor and feature work logically separated.
4. Preserve backward compatibility.
5. Document risks briefly in the PR or change summary.

## UI guidance for SattaDarshan
- Keep the interface clean, fast, and information-dense.
- Political data should feel trustworthy, not flashy.
- Prefer strong hierarchy, readable tables, filters, and comparison layouts.
- Use color sparingly; it should aid comprehension, not create a partisan feel.
- Avoid sensational styling for election or leader data.
- Maintain consistent labels for entities like party, constituency, state, alliance, candidate, result, and source.

## Content and data presentation rules
- Always show last updated time where relevant.
- Distinguish clearly between live data, historical data, estimated data, and manually curated data.
- If data is incomplete, show graceful empty states instead of fake placeholders.
- Preserve numeric formatting consistency for vote share, seat count, rank, margin, turnout, and timeline metrics.
- Use explicit labels for units and percentages.

## Component reuse rules
- Prefer extending existing table, card, badge, modal, and filter components.
- If creating a new component, make it generic enough for at least one likely future reuse.
- Do not create one-off components when a prop-based extension of an existing component works.
- Keep prop APIs simple and aligned with existing naming conventions.

## API and backend rules
- Preserve response shape compatibility whenever possible.
- Add fields without removing existing ones.
- Handle null and missing data defensively.
- Do not make endpoints slower by adding unnecessary joins or repeated fetches.
- If aggregation is expensive, prefer caching, precomputation, or server-side batching.

## Scraping and ingestion rules
If the codebase includes scrapers, crawlers, or ingestion jobs:
- Do not break current selectors or pipelines for unrelated changes.
- Keep source-specific parsing isolated.
- Add normalization at the edge of ingestion, not scattered across UI code.
- Log parsing failures with enough detail to debug source changes.
- Never silently swallow malformed political records.

## Performance rules
- Avoid client-side overfetching.
- Paginate large lists.
- Virtualize only where necessary; do not complicate simple screens.
- Memoize expensive derived computations when profiling justifies it.
- Keep dashboard pages responsive under slower networks and lower-end devices.

## Safety checklist before finalizing
- Is this the smallest change that solves the request?
- Did I avoid touching unrelated files?
- Did I preserve current UX and data behavior where not requested?
- Are source attribution and timestamps still intact?
- Is the change backward-compatible?
- Are loading, empty, and error states handled?
- Will another developer understand and review this quickly?

## Preferred workflow for agents
1. Read the request carefully.
2. Read all applicable AGENTS.md files.
3. Initialize all relevant custom subagents.
4. Trace the feature from UI to data source.
5. Identify exact files to edit.
6. Implement the minimal patch only if approval exists.
7. Test only impacted flows first, then nearby flows.
8. Summarize changed files and why.

## What not to do
- Do not do a full redesign for a minor enhancement.
- Do not replace current components because a new one looks cleaner.
- Do not introduce a new state management library without strong reason.
- Do not move business logic across layers unless necessary.
- Do not mix refactoring, styling overhaul, and feature delivery in one large opaque change.
- Do not remove source context from political content.

## Good examples
- “Add alliance filter to leader listing” → extend existing filter bar and query logic only.
- “Show last updated on constituency page” → add timestamp display using existing metadata source.
- “Add party comparison card” → reuse stats card and comparison table patterns.

## Bad examples
- “Add one column to a table” → rewrite full table system.
- “Add election trends widget” → replace dashboard layout and global styles.
- “Need better data model” → rename existing fields and break API consumers.

## Definition of done
A task is done when the requested improvement is implemented with a small, understandable, low-risk change that fits the current SattaDarshan architecture and does not disturb unrelated parts of the product.