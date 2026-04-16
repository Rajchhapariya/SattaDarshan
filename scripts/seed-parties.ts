import "dotenv/config";
import connectDB from "../lib/db";
import Party from "../models/Party";
import fs from "fs";
import path from "path";

async function main() {
  await connectDB();
  const rawPath = path.join(process.cwd(), "data", "parties_raw.json");
  const PARTIES = JSON.parse(fs.readFileSync(rawPath, "utf8"));
  
  let added = 0, updated = 0, skipped = 0;
  
  for (const party of PARTIES) {
    const exists = await Party.findOne({ slug: party.slug });
    const payload = {
      ...party,
      logo: party.logoFile ? `/flags/${party.slug}.png` : undefined
    };
    
    if (exists) { 
      await Party.updateOne({ slug: party.slug }, { $set: payload });
      updated++; 
    } else {
      await Party.create(payload);
      added++;
    }
  }
  
  console.log(`✅ Parties: ${added} added, ${updated} updated, ${skipped} skipped`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
