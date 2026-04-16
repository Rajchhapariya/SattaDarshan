const https = require("https");
const fs = require("fs");

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "SattaDarshan/1.0" } }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch(e) { resolve({}); } });
    }).on("error", reject);
  });
}

function toSlug(s) {
  return (s||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"unknown";
}

async function main() {
  console.log("🔍 Fetching 18th Lok Sabha (2024) members...");
  const url = "https://en.wikipedia.org/w/api.php?action=query&titles=List_of_members_of_the_18th_Lok_Sabha&prop=revisions&rvprop=content&rvslots=main&format=json&formatversion=2";
  const data = await get(url);
  const content = data?.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content ?? "";

  const politicians = [];
  const seen = new Set();
  const lines = content.split("\n");
  let state = "";

  for (const line of lines) {
    if (/^===[^=]/.test(line)) {
      state = line.replace(/=/g,"").trim();
    }
    if (!line.startsWith("|")) continue;

    const clean = line
      .replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g,"$2")
      .replace(/\{\{[^{}]+\}\}/g,"")
      .replace(/'''|''/g,"")
      .split("||")
      .map(s=>s.replace(/^\|/,"").trim())
      .filter(Boolean);

    if (clean.length < 2) continue;
    const name = clean[0].replace(/\(.+?\)/g,"").trim();
    if (!name || name.length < 3 || /^\d/.test(name) || seen.has(name)) continue;
    if (!/^[A-Z]/.test(name)) continue;
    seen.add(name);

    politicians.push({
      name,
      slug: toSlug(name),
      role: "MP",
      chamber: "Lok Sabha",
      loksabha: "18th",
      electedYear: 2024,
      constituency: clean[1] || "",
      partyName: clean[2] || "Independent",
      party: toSlug(clean[2] || "independent"),
      state,
    });
  }

  console.log(`✅ Found ${politicians.length} MPs`);
  fs.writeFileSync("data/politicians_raw.json", JSON.stringify(politicians, null, 2));
  console.log("💾 Saved to data/politicians_raw.json");
}

main().catch(console.error);