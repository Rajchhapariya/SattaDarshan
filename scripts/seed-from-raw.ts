import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import fs from "fs";
import connectDB from "../lib/db";
import Politician from "../models/Politician";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  await connectDB();
  const data = JSON.parse(fs.readFileSync("data/politicians_raw.json", "utf8"));
  let added = 0, skipped = 0;
  for (const p of data) {
    try {
      if (!p?.name || String(p.name).trim().length < 2) {
        skipped++;
        continue;
      }
      const slug = p.slug && String(p.slug).trim() !== "" ? p.slug : toSlug(String(p.name));
      const exists = await Politician.findOne({ slug });
      if (exists) { skipped++; continue; }
      await Politician.create({
        ...p,
        slug,
        name: String(p.name).trim(),
        role: p.role && String(p.role).trim() !== "" ? p.role : "MP",
        status: p.status && String(p.status).trim() !== "" ? p.status : "Active",
        state: p.state && String(p.state).trim() !== "" ? p.state : "India",
        chamber: p.chamber && String(p.chamber).trim() !== "" ? p.chamber : "Lok Sabha",
        party: p.party && p.party.trim() !== "" ? p.party : "independent",
        partyName: p.partyName && p.partyName.trim() !== "" ? p.partyName : "Independent",
      });
      added++;
      if (added % 50 === 0) console.log(`  ... ${added} added`);
    } catch (e: any) {
      console.log(`⚠️ Skipped ${p.name}: ${e.message}`);
      skipped++;
    }
  }
  console.log(`✅ Done: ${added} added, ${skipped} skipped`);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });