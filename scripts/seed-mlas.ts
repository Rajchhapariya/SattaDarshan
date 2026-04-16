import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import connectDB from "../lib/db";
import Politician from "../models/Politician";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

const STATE_ELECTIONS: Array<{
  state: string;
  stateName: string;
  wikiPage: string;
  seats: number;
}> = [
  { state: "uttar-pradesh", stateName: "Uttar Pradesh", wikiPage: "2022_Uttar_Pradesh_Legislative_Assembly_election", seats: 403 },
  { state: "maharashtra", stateName: "Maharashtra", wikiPage: "2024_Maharashtra_Legislative_Assembly_election", seats: 288 },
  { state: "west-bengal", stateName: "West Bengal", wikiPage: "2021_West_Bengal_legislative_assembly_election", seats: 294 },
  { state: "bihar", stateName: "Bihar", wikiPage: "2020_Bihar_legislative_assembly_election", seats: 243 },
  { state: "madhya-pradesh", stateName: "Madhya Pradesh", wikiPage: "2023_Madhya_Pradesh_Legislative_Assembly_election", seats: 230 },
  { state: "tamil-nadu", stateName: "Tamil Nadu", wikiPage: "2021_Tamil_Nadu_Legislative_Assembly_election", seats: 234 },
  { state: "rajasthan", stateName: "Rajasthan", wikiPage: "2023_Rajasthan_Legislative_Assembly_election", seats: 200 },
  { state: "karnataka", stateName: "Karnataka", wikiPage: "2023_Karnataka_Legislative_Assembly_election", seats: 224 },
  { state: "gujarat", stateName: "Gujarat", wikiPage: "2022_Gujarat_Legislative_Assembly_election", seats: 182 },
  { state: "andhra-pradesh", stateName: "Andhra Pradesh", wikiPage: "2024_Andhra_Pradesh_Legislative_Assembly_election", seats: 175 },
  { state: "telangana", stateName: "Telangana", wikiPage: "2023_Telangana_Legislative_Assembly_election", seats: 119 },
  { state: "odisha", stateName: "Odisha", wikiPage: "2024_Odisha_Legislative_Assembly_election", seats: 147 },
  { state: "kerala", stateName: "Kerala", wikiPage: "2021_Kerala_legislative_assembly_election", seats: 140 },
  { state: "jharkhand", stateName: "Jharkhand", wikiPage: "2024_Jharkhand_Legislative_Assembly_election", seats: 81 },
  { state: "assam", stateName: "Assam", wikiPage: "2021_Assam_Legislative_Assembly_election", seats: 126 },
  { state: "chhattisgarh", stateName: "Chhattisgarh", wikiPage: "2023_Chhattisgarh_Legislative_Assembly_election", seats: 90 },
  { state: "haryana", stateName: "Haryana", wikiPage: "2024_Haryana_Legislative_Assembly_election", seats: 90 },
  { state: "punjab", stateName: "Punjab", wikiPage: "2022_Punjab_Legislative_Assembly_election", seats: 117 },
  { state: "uttarakhand", stateName: "Uttarakhand", wikiPage: "2022_Uttarakhand_Legislative_Assembly_election", seats: 70 },
  { state: "himachal-pradesh", stateName: "Himachal Pradesh", wikiPage: "2022_Himachal_Pradesh_Legislative_Assembly_election", seats: 68 },
  { state: "goa", stateName: "Goa", wikiPage: "2022_Goa_Legislative_Assembly_election", seats: 40 },
  { state: "tripura", stateName: "Tripura", wikiPage: "2023_Tripura_Legislative_Assembly_election", seats: 60 },
  { state: "manipur", stateName: "Manipur", wikiPage: "2022_Manipur_Legislative_Assembly_election", seats: 60 },
  { state: "meghalaya", stateName: "Meghalaya", wikiPage: "2023_Meghalaya_Legislative_Assembly_election", seats: 60 },
  { state: "nagaland", stateName: "Nagaland", wikiPage: "2023_Nagaland_Legislative_Assembly_election", seats: 60 },
  { state: "arunachal-pradesh", stateName: "Arunachal Pradesh", wikiPage: "2024_Arunachal_Pradesh_Legislative_Assembly_election", seats: 60 },
  { state: "mizoram", stateName: "Mizoram", wikiPage: "2023_Mizoram_Legislative_Assembly_election", seats: 40 },
  { state: "sikkim", stateName: "Sikkim", wikiPage: "2024_Sikkim_Legislative_Assembly_election", seats: 32 },
  { state: "delhi", stateName: "Delhi", wikiPage: "2020_Delhi_Legislative_Assembly_election", seats: 70 },
  { state: "puducherry", stateName: "Puducherry", wikiPage: "2021_Puducherry_Legislative_Assembly_election", seats: 33 },
  { state: "jammu-and-kashmir", stateName: "Jammu & Kashmir", wikiPage: "2024_Jammu_and_Kashmir_Legislative_Assembly_election", seats: 90 },
];

async function fetchAndParsePage(wikiPage: string): Promise<Array<{ name: string; constituency: string; party: string }>> {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage}&prop=wikitext&format=json&origin=*`;
  const res = await fetch(url, { headers: { "User-Agent": "SattaDarshan/1.0" } });
  if (!res.ok) return [];
  const json = await res.json() as any;
  const wikitext: string = json.parse?.wikitext?.["*"] || "";
  if (!wikitext) return [];

  const members: Array<{ name: string; constituency: string; party: string }> = [];
  const rows = wikitext.split(/\n\|-/);

  for (const row of rows) {
    if (!row.toLowerCase().includes("assembly constituency")) continue;

    const cells = row.split(/\n[\|!]/).map(c => c.trim()).filter(c => c.length > 0);
    if (cells.length < 5) continue;

    let constituency = "";
    let name = "";
    let party = "";

    for (let c of cells) {
      if (c.toLowerCase().includes("assembly constituency")) {
        constituency = c.match(/\[\[(.*?)\]\]/)?.[1]?.split('|')?.[1] || c.match(/\[\[(.*?)\]\]/)?.[1] || "";
        constituency = constituency.replace(/ Assembly constituency/i, "").trim();
      } else if (!name && !c.match(/^[\d\.]+$/) && !c.includes("party color") && c.length > 3) {
        let match = c.match(/\[\[(.*?)\]\]/)?.[1];
        if (match) {
          name = match.split('|')?.[1] || match;
        } else if (!c.includes("{") && !c.includes("}")) {
          name = c;
        }
      } else if (!party && (c.includes("party color") || c.includes("Party") || c.includes("Congress") || c.includes("Samajwadi") || c.includes("Morcha") || c.includes("Front"))) {
        // If it's a bgcolor party reference, extract party name
        const bgcolorMatch = c.match(/\{\{party color\|(.*?)\}\}/);
        if (bgcolorMatch) {
          party = bgcolorMatch[1];
        } else {
          let match = c.match(/\[\[(.*?)\]\]/)?.[1];
          if (match) {
            party = match.split('|')?.[1] || match;
          } else {
            party = c.replace(/\[\[.*?\]\]/g, "").trim();
          }
        }
      }
    }

    if (name && constituency && party && !name.includes("election_name") && !name.includes("Socialist Unity")) {
      members.push({ name, constituency, party });
    }
  }

  // Remove duplicates based on constituency to avoid duplicate scraping from runner up
  const uniqueMembers = [];
  const hit = new Set();
  for (const m of members) {
    if (!hit.has(m.constituency)) {
      hit.add(m.constituency);
      uniqueMembers.push(m);
    }
  }

  return uniqueMembers;
}

async function fetchPhotosForMembers(members: any[]): Promise<Record<string, string>> {
  const photoMap: Record<string, string> = {};
  // Process in batches of 50 (MediaWiki limit)
  for (let i = 0; i < members.length; i += 50) {
    const batch = members.slice(i, i + 50);
    const titles = batch.map(m => m.name).join("|");
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
    
    try {
      const res = await fetch(url, { headers: { "User-Agent": "SattaDarshan/1.0" } });
      if (!res.ok) continue;
      const json = await res.json() as any;
      const pages = json.query?.pages || {};
      
      for (const pageId in pages) {
        const page = pages[pageId];
        if (page.thumbnail?.source) {
          photoMap[page.title] = page.thumbnail.source;
        }
      }
    } catch (e) {
      console.log(`   ⚠️ Photo batch error: ${e}`);
    }
    await sleep(200);
  }
  return photoMap;
}

async function main() {
  await connectDB();
  console.log("🚀 Starting MLA ingestion from Wikipedia Election Pages...\n");

  console.log("  🗑️  Clearing old Vidhan Sabha records...");
  await Politician.deleteMany({ chamber: "Vidhan Sabha" });

  let totalImported = 0;

  for (const stateInfo of STATE_ELECTIONS) {
    console.log(`\n📋 ${stateInfo.stateName} (${stateInfo.seats} seats)...`);

    try {
      const members = await fetchAndParsePage(stateInfo.wikiPage);
      console.log(`   Parsed ${members.length} unique MLA entries.`);
      console.log(`   📸 Fetching photos for ${stateInfo.stateName} MLAs...`);
      const photoMap = await fetchPhotosForMembers(members);
      console.log(`   Found ${Object.keys(photoMap).length} photos.`);

      let stateImported = 0;
      for (const m of members) {
        const slug = `${toSlug(m.name)}-${stateInfo.state}-mla`;
        let partySlug = toSlug(m.party);
        
        try {
          await Politician.updateOne(
            { slug },
            {
              $set: {
                slug,
                name: m.name,
                role: "MLA",
                status: "Active",
                party: partySlug,
                partyName: m.party,
                photo: photoMap[m.name] || "",
                state: stateInfo.stateName,
                constituency: m.constituency,
                chamber: "Vidhan Sabha",
                term: "Current",
                sourceUrl: `https://en.wikipedia.org/wiki/${stateInfo.wikiPage}`,
                sourceVerifiedOn: new Date(),
              }
            },
            { upsert: true }
          );
          stateImported++;
          totalImported++;
        } catch { /* skip dupes */ }
      }
      console.log(`   ✅ ${stateImported} MLAs imported for ${stateInfo.stateName}`);
    } catch (e: any) {
      console.log(`   ⚠️  ${e.message}`);
    }

    await sleep(400); // Respect Wikipedia API limits
  }

  const finalCount = await Politician.countDocuments({ chamber: "Vidhan Sabha" });
  console.log(`\n✅ Total in MongoDB: ${finalCount} MLAs`);
}

main().catch(console.error).finally(() => process.exit(0));
