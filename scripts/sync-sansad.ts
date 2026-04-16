import puppeteer from "puppeteer";
import "dotenv/config";
import connectDB from "../lib/db";
import Politician from "../models/Politician";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function fetchWithRetry(page: any, url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`  🔗 Navigating to ${url} (Attempt ${i + 1})...`);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 300000 });
      return true;
    } catch (e: any) {
      console.log(`  ⚠️ Attempt ${i + 1} failed: ${e.message}`);
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

async function main() {
  await connectDB();

  const targetChamber = process.env.SYNC_CHAMBER || "ALL";
  console.log(`🚀 Starting Sansad.in robust sync for: ${targetChamber}...`);
  
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] 
  });
  
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36");
  await page.setDefaultNavigationTimeout(300000);

  let allResults: any[] = [];

  // ─── LOK SABHA ────────────────────────────────────────────
  if (targetChamber === "ALL" || targetChamber === "Lok Sabha") {
    console.log("\n📋 Fetching Lok Sabha Members...");
    try {
      await fetchWithRetry(page, "https://sansad.in/ls/members");

      // Try to click "Show All" or set entries to maximum
      try {
        await page.waitForSelector("select[name$='_length'], .dataTables_length select", { timeout: 30000 });
        await page.evaluate(() => {
          const selects = document.querySelectorAll("select[name$='_length'], .dataTables_length select");
          selects.forEach((sel: any) => {
            const options = Array.from(sel.querySelectorAll("option"));
            const allOption = options.find((opt: any) => opt.value === "-1" || opt.textContent.toLowerCase().includes("all"));
            if (allOption) { sel.value = (allOption as any).value; } 
            else { sel.value = "100"; }
            sel.dispatchEvent(new Event("change", { bubbles: true }));
          });
        });
        await new Promise(r => setTimeout(r, 10000));
      } catch (e) {
        console.log("  ⚠️ Pagination selector not found, attempting to scrape visible rows");
      }

      const lsMembers = await page.evaluate(() => {
        const rows = document.querySelectorAll("table tbody tr");
        const members: any[] = [];
        rows.forEach(tr => {
          const tds = tr.querySelectorAll("td");
          if (tds.length < 4) return;
          const name = (tds[1]?.innerText || "").trim().replace(/\n/g, " ").replace(/\s+/g, " ");
          const party = (tds[2]?.innerText || "").trim();
          const constituency = (tds[3]?.innerText || "").trim();
          const state = (tds[4]?.innerText || tds[3]?.innerText || "").trim();
          const photo = tds[1]?.querySelector("img")?.src || "";
          if (name && name.length > 1 && party) {
            members.push({
              name, partyName: party, constituency, state, photo,
              role: "MP", chamber: "Lok Sabha", term: "18th Lok Sabha"
            });
          }
        });
        return members;
      });

      // Deduplicate
      const uniqueLS: any[] = [];
      const seenLS = new Set();
      for (const m of lsMembers) {
        const key = `${m.name}-${m.constituency}`;
        if (!seenLS.has(key)) { seenLS.add(key); uniqueLS.push(m); }
      }
      console.log(`  📊 Extracted ${uniqueLS.length} unique Lok Sabha members`);
      allResults = [...allResults, ...uniqueLS];
    } catch (e: any) {
      console.error(`  ❌ Failed to fetch Lok Sabha: ${e.message}`);
    }
  }

  // ─── RAJYA SABHA ──────────────────────────────────────────
  if (targetChamber === "ALL" || targetChamber === "Rajya Sabha") {
    console.log("\n📋 Fetching Rajya Sabha Members...");
    try {
      await fetchWithRetry(page, "https://sansad.in/rs/members");

      try {
        await page.waitForSelector("select[name$='_length'], .dataTables_length select", { timeout: 30000 });
        await page.evaluate(() => {
          const selects = document.querySelectorAll("select[name$='_length'], .dataTables_length select");
          selects.forEach((sel: any) => {
            const options = Array.from(sel.querySelectorAll("option"));
            const allOption = options.find((opt: any) => opt.value === "-1" || opt.textContent.toLowerCase().includes("all"));
            if (allOption) { sel.value = (allOption as any).value; } else { sel.value = "100"; }
            sel.dispatchEvent(new Event("change", { bubbles: true }));
          });
        });
        await new Promise(r => setTimeout(r, 10000));
      } catch (e) {}

      let rsMembers: any[] = [];
      let pageNum = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          await page.waitForSelector("table tbody tr", { timeout: 30000 });
          const pageMembers = await page.evaluate(() => {
            const rows = document.querySelectorAll("table tbody tr");
            const members: any[] = [];
            rows.forEach(tr => {
              const tds = tr.querySelectorAll("td");
              if (tds.length < 3) return;
              const nameText = (tds[1]?.innerText || "").trim().split("\n")[0].trim();
              const party = (tds[2]?.innerText || "").trim();
              let state = (tds[3]?.innerText || "").trim() || "(Nominated)";
              const photo = tds[1]?.querySelector("img")?.src || "";
              if (nameText && nameText.length > 1 && party) {
                members.push({ name: nameText, partyName: party, state, photo, role: "MP", chamber: "Rajya Sabha", term: "Current" });
              }
            });
            return members;
          });

          for (const m of pageMembers) {
            if (!rsMembers.find(existing => existing.name === m.name)) { rsMembers.push(m); }
          }

          const nextButtonSelector = 'button[aria-label="Go to next page"]';
          const isNextDisabled = await page.evaluate((sel) => {
            const btn = document.querySelector(sel);
            return !btn || btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true';
          }, nextButtonSelector);

          if (!isNextDisabled) {
            await page.click(nextButtonSelector);
            pageNum++;
            await new Promise(r => setTimeout(r, 4000));
          } else { hasMore = false; }
          if (pageNum > 10) hasMore = false;
        } catch (e) { hasMore = false; }
      }

      console.log(`  📊 Extracted ${rsMembers.length} total Rajya Sabha members`);
      allResults = [...allResults, ...rsMembers];
    } catch (e: any) { console.error(`  ❌ Failed to fetch Rajya Sabha: ${e.message}`); }
  }

  await browser.close();

  // ─── INSERT TO DB (Only if we have results) ────────────────
  if (allResults.length > 0) {
    if (targetChamber === "ALL") {
      await Politician.deleteMany({ chamber: { $in: ["Lok Sabha", "Rajya Sabha"] } });
    } else {
      await Politician.deleteMany({ chamber: targetChamber });
    }
    
    console.log(`\n💾 Inserting ${allResults.length} records...`);
    let imported = 0;
    for (const m of allResults) {
      const slug = toSlug(m.name);
      await Politician.updateOne({ slug }, { $set: { ...m, slug, party: toSlug(m.partyName), sourceUrl: "https://sansad.in", sourceVerifiedOn: new Date(), status: "Active" } }, { upsert: true });
      imported++;
      if (imported % 100 === 0) console.log(`  ... ${imported} / ${allResults.length} imported`);
    }
    console.log(`\n✅ Successfully synced ${imported} records!`);
  } else {
    console.log("\n⚠️ No records were extracted. Database remains unchanged.");
  }
}

main().catch(console.error).finally(() => process.exit(0));
