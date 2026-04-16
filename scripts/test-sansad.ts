import fs from "fs";

async function testSansad(url: string) {
  console.log(`Fetching ${url}...`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36"
      }
    });
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    fs.writeFileSync("sansad_test.html", text);
    console.log(`Saved ${text.length} bytes to sansad_test.html`);
  } catch (e) {
    console.error(e);
  }
}

testSansad("https://sansad.in/ls/members");
