import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import mongoose from "mongoose";

const URI = process.env.MONGODB_URI!;

const PoliticianSchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true },
  role: { type: String, default: "MP" },
  chamber: String, constituency: String,
  party: { type: String, default: "independent" },
  partyName: String, state: String,
}, { strict: false });

const Politician = mongoose.models.Politician || mongoose.model("Politician", PoliticianSchema);

function toSlug(s: string) {
  return (s||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "unknown";
}

async function main() {
  await mongoose.connect(URI);
  console.log("✅ Connected to MongoDB");

  await Politician.deleteMany({});
  console.log("🗑️ Cleared collection");

  const data = JSON.parse(fs.readFileSync("data/politicians_raw.json", "utf8"));
  console.log(`📦 ${data.length} records in JSON`);

  const seen = new Set<string>();
  const docs = [];

  for (const p of data) {
    if (!p.name || p.name.length < 3) continue;
    const slug = toSlug(p.name);
    if (seen.has(slug)) continue;
    seen.add(slug);
    docs.push({
      name: p.name.trim(),
      slug,
      role: "MP",
      chamber: "Lok Sabha",
      constituency: p.constituency || "",
      party: p.party || "independent",
      partyName: p.partyName || "Independent",
      state: p.state || "",
    });
  }

  // Insert in batches of 100
  let added = 0;
  for (let i = 0; i < docs.length; i += 100) {
    const batch = docs.slice(i, i + 100);
    await Politician.insertMany(batch, { ordered: false });
    added += batch.length;
    console.log(`  ... ${added} added`);
  }

  console.log(`✅ Total added: ${added}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });