import connectDB from "../lib/db";
import Politician from "../models/Politician";

async function run() {
  await connectDB();

  // Find all politicians and check duplicate clean names
  const all = await Politician.find().select("name slug role partyName state chamber").lean();
  console.log(`Total politicians: ${all.length}`);

  const nameMap = new Map<string, any[]>();
  for (const p of all) {
    // Strip honorifics
    const clean = p.name
      .replace(/^(Shri|Smt\.|Dr\.|Prof\.|Adv\.|Km\.|Kumari|Hon['’]ble)\s+/i, "")
      .trim()
      .toLowerCase();
    
    if (!nameMap.has(clean)) nameMap.set(clean, []);
    nameMap.get(clean)!.push(p);
  }

  const duplicates: any[] = [];
  for (const [cleanName, records] of nameMap.entries()) {
    if (records.length > 1) {
      duplicates.push({ cleanName, records });
    }
  }

  console.log(`Found ${duplicates.length} potential duplicate names:`);
  for (const d of duplicates) {
    console.log(`\nDuplicate: "${d.cleanName}" (${d.records.length} records):`);
    for (const r of d.records) {
      console.log(`  - [${r.slug}] name: "${r.name}", role: "${r.role}", party: "${r.partyName}", chamber: "${r.chamber}"`);
    }
  }

  process.exit(0);
}
run();
