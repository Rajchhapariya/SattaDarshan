async function run() {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=2022_Uttar_Pradesh_Legislative_Assembly_election&prop=wikitext&format=json&origin=*`;
  const res = await fetch(url);
  const json = await res.json();
  const text = json.parse.wikitext["*"];
  
  // Find tables and print the start of them
  const lines = text.split("\n");
  for(let i = 0; i < lines.length; i++) {
    if (lines[i].includes("== Elected members ==") || lines[i].includes("==Elected members==") || lines[i].includes("==Results by constituency==") || lines[i].includes("== Results by constituency ==")) {
      console.log(lines.slice(i, i+50).join('\n'));
      break;
    }
  }
}
run();
