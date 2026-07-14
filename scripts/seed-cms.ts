import puppeteer from "puppeteer";
import "dotenv/config";
import connectDB from "../lib/db";
import Politician from "../models/Politician";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  await connectDB();
  console.log("🚀 Starting Chief Ministers Scraper...");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto("https://en.wikipedia.org/wiki/List_of_current_Indian_chief_ministers", { waitUntil: "networkidle2" });

  const cms = await page.evaluate(() => {
    const rows = document.querySelectorAll("table.wikitable tbody tr");
    const results: any[] = [];
    
    rows.forEach(tr => {
      const th = tr.querySelector("th"); // State is usually in TH
      const tds = tr.querySelectorAll("td");
      if (!th || tds.length < 5) return;
      
      const state = th.innerText.trim().split("\n")[0];
      const name = (tds[0]?.innerText || tds[1]?.innerText || "").trim().replace(/\[.*?\]/g, ""); // Sometimes Name is in 1st or 2nd TD depending on portrait
      
      // Determine where the portrait is. Usually TD 1 or 0
      let photoUrl = "";
      let party = "";
      
      tds.forEach((td, index) => {
        const img = td.querySelector("img");
        if (img && img.src.includes("thumb") && parseInt(img.width + "") >= 50) {
          photoUrl = img.src.replace(/\/thumb\//, "/").replace(/\/[^\/]+$/, ""); // get full res
        }
        
        // Guess party based on background color or common names
        const text = td.innerText;
        if (text.includes("Bharatiya Janata Party") || text === "BJP") party = "BJP";
        else if (text.includes("Indian National Congress") || text === "INC") party = "INC";
        else if (text.includes("Aam Aadmi Party") || text === "AAP") party = "AAP";
        else if (text.includes("All India Trinamool Congress") || text === "TMC") party = "TMC";
        else if (text.includes("Communist Party of India (Marxist)")) party = "CPI(M)";
        // If not caught by easy heuristics, grab the first link that isn't the name or a date
        else if (!party && td.querySelector("a") && !text.match(/^[0-9]/)) {
            const a = td.querySelector("a");
            if (a && !a.href.includes("wiki/List_of_") && !a.href.includes(name.replace(" ", "_"))) {
               party = text.replace(/\[.*?\]/g, "").trim().split("\n")[0];
            }
        }
      });
      
      // Secondary fallback for Name if parsing was weird
      let finalName = name;
      const bTag = tds[1]?.querySelector("b");
      if (bTag) finalName = bTag.innerText.replace(/\[.*?\]/g, "").trim();
      else if (tds[1]?.querySelector("a")) finalName = (tds[1].querySelector("a") as HTMLAnchorElement).innerText;
      else if (tds[0]?.querySelector("a") && !tds[0].querySelector("img")) finalName = (tds[0].querySelector("a") as HTMLAnchorElement).innerText;
      else if (tds[2]?.querySelector("a")) finalName = (tds[2].querySelector("a") as HTMLAnchorElement).innerText; // Just in case
      
      // Fallback party
      if (!party) party = "Independent";
      
      if (finalName && finalName.length > 3 && !finalName.includes("Vacant")) {
        results.push({
          name: finalName,
          state,
          partyName: party,
          photo: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&size=200`,
          role: "Chief Minister",
          chamber: "State Assembly",
          status: "Active"
        });
      }
    });
    return results;
  });

  await browser.close();

  console.log(`📊 Extracted ${cms.length} Chief Ministers from Wikipedia.`);
  
  // Normalization & DB Insert
  let imported = 0;
  for (const m of cms) {
    if (m.partyName === "Bharatiya Janata Party") m.partyName = "BJP";
    if (m.partyName === "Indian National Congress") m.partyName = "INC";
    if (m.partyName === "Aam Aadmi Party") m.partyName = "AAP";
    
    // Some CMs are already in DB as "CM" from the leadership seed, delete those to avoid duplicates
    await Politician.deleteOne({ slug: toSlug(m.name), role: "CM" });

    const slug = toSlug(m.name);
    await Politician.updateOne(
      { slug }, 
      { $set: { ...m, slug, party: toSlug(m.partyName), sourceUrl: "https://en.wikipedia.org/wiki/List_of_current_Indian_chief_ministers", sourceVerifiedOn: new Date() } }, 
      { upsert: true }
    );
    imported++;
  }

  console.log(`✅ Successfully seeded ${imported} Chief Ministers!`);
}

main().catch(console.error).finally(() => process.exit(0));
