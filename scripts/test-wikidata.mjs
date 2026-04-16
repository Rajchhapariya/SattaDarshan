// Find constituency results table patterns
const page = "2024_Haryana_Legislative_Assembly_election";
const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${page}&prop=wikitext&format=json&origin=*`;

fetch(url, { headers: { "User-Agent": "SattaDarshan/1.0" } })
  .then(r => r.json())
  .then(j => {
    const wikitext = j.parse?.wikitext?.["*"] || "";
    
    // Search for patterns with candidate names after constituency
    // In election result tables, the winner is usually bolded or the first candidate listed
    // Pattern: | [[Constituency Name]] || [[Candidate Name]] || [[Party]] ||
    
    // Show full text around "== Results by constituency ==" or "Results of the"
    const patterns = ["constituency", "Constituency-wise", "segment", "Assembly segment", "Winner"];
    for (const p of patterns) {
      const idx = wikitext.indexOf(p);
      if (idx > 0) {
        console.log(`\n=== Found "${p}" at ${idx} ===`);
        console.log(wikitext.slice(Math.max(0, idx-50), idx + 500));
        break;
      }
    }

    // Also search for link patterns: | [[SomeName]] links that appear after digit rows (vote counts)
    const lines = wikitext.split("\n");
    const candidateLines = lines.filter(l => l.match(/^\|\s*\[\[[A-Z][^\]]{4,40}\]\]/));
    console.log(`\nFound ${candidateLines.length} potential candidate lines`);
    console.log(candidateLines.slice(0, 15).join("\n"));
  });
