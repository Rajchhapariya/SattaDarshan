import fs from "fs";

function extractFile(str: string) {
  const match = str.match(/\[\[File:([^|\]]+)/i);
  if (match) return match[1].replace(/\{\{!\}\}.*/, "").trim();
  return null;
}

function toSlug(s: string) {
  return (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function main() {
  const raw = fs.readFileSync("wiki-parties.txt", "utf8");
  const parties: any[] = [];
  
  // Use regex to locate each party row
  // We can look for {{Full party name with color|XXXX}} and then grab chunk following it until the next |-
  const rows = raw.split("|-");
  
  for (const row of rows) {
    const nameMatch = row.match(/\{\{Full party name with color\|([^}|]+)/i);
    // some are not with color: {{Plainlist|...}} no, all in table list use Full party name with color
    if (!nameMatch) {
       const altMatch = row.match(/\{\{party name with color\|([^}|]+)/i);
       if (!altMatch) continue;
    }
    
    const name = nameMatch ? nameMatch[1].trim() : "";
    if (!name) continue;
    
    const isNational = row.includes("'''"); // Abbr is usually bolded
    let tier = isNational ? "National" : "State";
    
    // Find all files
    const files = [...row.matchAll(/\[\[File:([^|\]]+)/gi)].map(m => m[1].replace(/\{\{!\}\}.*/, "").trim());
    let logoFile = files.find(f => f.toLowerCase().includes("symbol") || f.toLowerCase().includes("flag") || f.toLowerCase().includes("logo")) || files[0] || null;
    
    let founded = row.match(/\b(18|19|20)\d{2}\b/)?.[0] || "";
    
    parties.push({
      slug: toSlug(name),
      name,
      tier,
      logoFile,
      founded,
      status: "Active"
    });
  }

  // Deduplicate
  const out = [];
  const seen = new Set();
  for (const p of parties) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }

  console.log(`✅ Parsed ${out.length} parties`);
  if (!fs.existsSync("data")) fs.mkdirSync("data");
  fs.writeFileSync("data/parties_raw.json", JSON.stringify(out, null, 2));
}

main();
