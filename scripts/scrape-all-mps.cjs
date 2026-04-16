const https = require("https");
const fs = require("fs");

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "SattaDarshan/1.0 (contact@sattadarshan.in)" } }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch(e) { resolve({}); } });
    }).on("error", reject);
  });
}

function toSlug(s) {
  return (s||"").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unknown";
}

function cleanWikiText(value) {
  return (value || "")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\{\{Full party name with colour\|([^|}]+)(?:\|[^}]*)?\}\}/gi, "$1")
    .replace(/\{\{Party abbreviation\|([^|}]+)(?:\|[^}]*)?\}\}/gi, "$1")
    .replace(/\{\{[^{}]+\}\}/g, "")
    .replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, "$2")
    .replace(/'''|''/g, "")
    .replace(/\([^)]*\)/g, (m) => (/\(SC\)|\(ST\)/i.test(m) ? m : ""))
    .replace(/\s+/g, " ")
    .trim();
}

function parseRow(lines, fallbackParty) {
  const values = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line.startsWith("|")) continue;
    const parts = line
      .replace(/^\|+/, "")
      .split("||")
      .map((p) => cleanWikiText(p))
      .filter(Boolean);
    values.push(...parts);
  }

  if (values.length < 2) return null;
  const constituency = values[0];
  const name = values[1];
  const partyName = values[2] || fallbackParty || "Independent";

  if (!name || name.length < 4) return null;
  if (!/\s/.test(name)) return null;
  if (/^(constituency|name|party|keys?|others?)$/i.test(name)) return null;
  if (!constituency || constituency.length < 3) return null;

  return { constituency, name, partyName };
}

async function fetchMPs() {
  console.log("🔍 Fetching 18th Lok Sabha MPs (wikicode parser)...");

  const url = "https://en.wikipedia.org/w/api.php?action=query&titles=List_of_members_of_the_18th_Lok_Sabha&prop=revisions&rvprop=content&rvslots=main&format=json&formatversion=2";
  const data = await getJson(url);
  const content = data?.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content ?? "";
  if (!content) {
    console.error("❌ Could not fetch Wikipedia content");
    return [];
  }

  const politicians = [];
  const seen = new Set();
  const lines = content.split("\n");
  let currentState = "";
  let inTable = false;
  let rowLines = [];
  let carryParty = "";

  const flushRow = () => {
    if (!rowLines.length) return;
    const parsed = parseRow(rowLines, carryParty);
    rowLines = [];
    if (!parsed) return;

    const { constituency, name, partyName } = parsed;
    carryParty = partyName;

    const slug = toSlug(name);
    if (seen.has(slug)) return;
    seen.add(slug);

    politicians.push({
      name,
      slug,
      role: "MP",
      chamber: "Lok Sabha",
      constituency,
      party: toSlug(partyName) || "independent",
      partyName: partyName || "Independent",
      state: currentState || "India",
      status: "Active",
    });
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    const stateMatch = line.match(/^==\s*([^=].*?)\s*==$/);
    if (stateMatch) {
      currentState = stateMatch[1].trim();
      continue;
    }

    if (line.startsWith("{|")) {
      inTable = true;
      rowLines = [];
      carryParty = "";
      continue;
    }
    if (!inTable) continue;
    if (line.startsWith("|}")) {
      flushRow();
      inTable = false;
      continue;
    }
    if (line.startsWith("|-")) {
      flushRow();
      continue;
    }
    if (line.startsWith("|") || line.startsWith("!")) {
      rowLines.push(line);
    }
  }
  flushRow();

  // Deduplicate final list
  const final = [];
  const slugsSeen = new Set();
  for (const p of politicians) {
    if (slugsSeen.has(p.slug)) continue;
    slugsSeen.add(p.slug);
    final.push(p);
  }

  console.log(`✅ Found ${final.length} MPs`);
  fs.writeFileSync("data/politicians_raw.json", JSON.stringify(final, null, 2));
  console.log("💾 Saved to data/politicians_raw.json");
  return final;
}

fetchMPs().catch(console.error);