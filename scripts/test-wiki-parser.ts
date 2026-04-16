async function run() {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=2022_Uttar_Pradesh_Legislative_Assembly_election&prop=wikitext&format=json&origin=*`;
  const res = await fetch(url);
  const json = await res.json();
  const wikitext = json.parse.wikitext["*"];

  const members: any[] = [];
  const rows = wikitext.split(/\n\|-/);
  for (const row of rows) {
    if (!row.includes("Assembly constituency") && !row.includes("assembly constituency")) continue;

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
      } else if (!party && (c.includes("Party") || c.includes("Congress") || c.includes("Samajwadi") || c.includes("Morcha") || c.includes("Dal") || c.includes("JDU"))) {
        let match = c.match(/\[\[(.*?)\]\]/)?.[1];
        if (match) {
          party = match.split('|')?.[1] || match;
        } else {
          party = c.replace(/\[\[.*?\]\]/g, "").trim();
        }
      }
    }

    if (name && constituency && party) {
      members.push({ name, constituency, party });
    }
  }

  console.log(`Extracted: ${members.length} records`);
  console.dir(members.slice(0, 10), { depth: null });
}
run();
