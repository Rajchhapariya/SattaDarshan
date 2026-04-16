import puppeteer from 'puppeteer';

async function testScrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto("https://en.wikipedia.org/wiki/2022_Uttar_Pradesh_Legislative_Assembly_election", { waitUntil: "networkidle2" });
  
  const mlas = await page.evaluate(() => {
    const results: any[] = [];
    const tables = Array.from(document.querySelectorAll('table.wikitable'));
    
    for (const table of tables) {
      const headerRow = table.querySelector('tr');
      if (!headerRow) continue;
      
      const headers = Array.from(headerRow.querySelectorAll('th, td')).map(h => h.textContent?.toLowerCase().trim() || "");
      
      const memberIdx = headers.findIndex(h => h.includes('member') || h.includes('winner') || h.includes('candidate'));
      const constIdx = headers.findIndex(h => h.includes('constituency'));
      const partyIdx = headers.findIndex(h => h.includes('party'));
      
      if (memberIdx === -1 || constIdx === -1 || partyIdx === -1) continue;
      
      const rows = Array.from(table.querySelectorAll('tr')).slice(1); // skip header
      for (const row of rows) {
        const tds = Array.from(row.querySelectorAll('td'));
        if (tds.length <= Math.max(memberIdx, constIdx, partyIdx)) continue;
        
        let name = tds[memberIdx]?.textContent?.replace(/\[\d+\]/g, '').trim() || "";
        let constituency = tds[constIdx]?.textContent?.replace(/\[\d+\]/g, '').trim() || "";
        let party = tds[partyIdx]?.textContent?.replace(/\[\d+\]/g, '').trim() || "";
        
        // Clean up
        name = name.split('\n')[0].trim();
        constituency = constituency.split('\n')[0].trim();
        party = party.split('\n')[0].trim();
        
        if (name && constituency && party) {
          results.push({ name, constituency, party });
        }
      }
    }
    return results;
  });
  
  console.log(`Extracted: ${mlas.length} records`);
  console.dir(mlas.slice(0, 10), { depth: null });
  await browser.close();
}

testScrape().catch(console.error);
