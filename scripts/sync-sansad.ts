import puppeteer from "puppeteer";
import "dotenv/config";
import connectDB from "../lib/db";
import Politician from "../models/Politician";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  await connectDB();

  const targetChamber = process.env.SYNC_CHAMBER || "ALL";

  console.log(`🚀 Starting Sansad.in sync for: ${targetChamber}...`);
  
  if (targetChamber === "ALL") {
    console.log("⚠️  Purging old Lok Sabha + Rajya Sabha records...");
    await Politician.deleteMany({ chamber: { $in: ["Lok Sabha", "Rajya Sabha"] } });
  } else {
    console.log(`⚠️  Purging old ${targetChamber} records...`);
    await Politician.deleteMany({ chamber: targetChamber });
  }

  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] 
  });
  
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36");
  // Set default timeout to 2 minutes
  await page.setDefaultNavigationTimeout(120000);

  let allResults: any[] = [];

  // ─── LOK SABHA ────────────────────────────────────────────
  if (targetChamber === "ALL" || targetChamber === "Lok Sabha") {
    console.log("\n📋 Fetching Lok Sabha Members from sansad.in/ls/members ...");
    try {
      await page.goto("https://sansad.in/ls/members", { waitUntil: "networkidle2" });

      // Try to click "Show All" or set entries to maximum
      try {
        await page.waitForSelector("select[name$='_length'], .dataTables_length select", { timeout: 15000 });
        await page.evaluate(() => {
          const selects = document.querySelectorAll("select[name$='_length'], .dataTables_length select");
          selects.forEach((sel: any) => {
            const options = Array.from(sel.querySelectorAll("option"));
            const allOption = options.find((opt: any) => opt.value === "-1" || opt.textContent.toLowerCase().includes("all"));
            if (allOption) {
              sel.value = (allOption as any).value;
            } else {
              sel.value = "100"; // fallback
            }
            sel.dispatchEvent(new Event("change", { bubbles: true }));
          });
        });
        console.log("  ✅ Set table to show all entries");
        await new Promise(r => setTimeout(r, 5000));
      } catch (e) {
        console.log("  ⚠️  Pagination selector not found or timed out");
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
          if (name && name.length > 1 && party) {
            members.push({
              name, partyName: party, constituency, state,
              role: "MP", chamber: "Lok Sabha", term: "18th Lok Sabha"
            });
          }
        });
        return members;
      });
      console.log(`  📊 Extracted ${lsMembers.length} Lok Sabha members`);
      allResults = [...allResults, ...lsMembers];
    } catch (e: any) {
      console.error(`  ❌ Failed to fetch Lok Sabha: ${e.message}`);
    }
  }

  // ─── RAJYA SABHA ──────────────────────────────────────────
  if (targetChamber === "ALL" || targetChamber === "Rajya Sabha") {
    console.log("\n📋 Fetching Rajya Sabha Members from sansad.in/rs/members ...");
    try {
      await page.goto("https://sansad.in/rs/members", { waitUntil: "networkidle2" });

      // Critical: Set pagination to show ALL rows
      try {
        await page.waitForSelector("select[name$='_length'], .dataTables_length select", { timeout: 15000 });
        await page.evaluate(() => {
          const selects = document.querySelectorAll("select[name$='_length'], .dataTables_length select");
          selects.forEach((sel: any) => {
            const options = Array.from(sel.querySelectorAll("option"));
            const allOption = options.find((opt: any) => opt.value === "-1" || opt.textContent.toLowerCase().includes("all"));
            if (allOption) {
              sel.value = (allOption as any).value;
            } else {
              sel.value = "100";
            }
            sel.dispatchEvent(new Event("change", { bubbles: true }));
          });
        });
        console.log("  ✅ Set table to show all entries");
        await new Promise(r => setTimeout(r, 8000));
      } catch (e) {
        console.log("  ⚠️  Pagination selector not found, falling back to page-by-page");
      }

      let rsMembers: any[] = [];
      let pageNum = 1;
      let hasMore = true;

      while (hasMore) {
        // Wait for the table rows to be present
        await page.waitForSelector("table tbody tr", { timeout: 15000 });
        
        const pageMembers = await page.evaluate(() => {
          const rows = document.querySelectorAll("table tbody tr");
          const members: any[] = [];
          rows.forEach(tr => {
            const tds = tr.querySelectorAll("td");
            if (tds.length < 3) return;
            // Extract Name, Party, State
            const nameText = (tds[1]?.innerText || "").trim().split("\n")[0].trim();
            const party = (tds[2]?.innerText || "").trim();
            let state = (tds[3]?.innerText || "").trim();
            if (!state) state = "(Nominated)";
            
            if (nameText && nameText.length > 1 && party) {
              members.push({
                name: nameText, partyName: party, state,
                role: "MP", chamber: "Rajya Sabha", term: "Current"
              });
            }
          });
          return members;
        });

        console.log(`  📄 Page ${pageNum}: Found ${pageMembers.length} members`);
        
        for (const m of pageMembers) {
          if (!rsMembers.find(existing => existing.name === m.name)) {
            rsMembers.push(m);
          }
        }

        // Try to click the next page button using aria-label
        const nextButtonSelector = 'button[aria-label="Go to next page"]';
        const isNextDisabled = await page.evaluate((sel) => {
          const btn = document.querySelector(sel);
          return !btn || btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true';
        }, nextButtonSelector);

        if (!isNextDisabled) {
          await page.click(nextButtonSelector);
          pageNum++;
          await new Promise(r => setTimeout(r, 4000)); // Wait for render
        } else {
          hasMore = false;
        }
        
        if (pageNum > 10) hasMore = false; // Safety break
      }

      console.log(`  📊 Extracted ${rsMembers.length} total Rajya Sabha members`);
      allResults = [...allResults, ...rsMembers];
    } catch (e: any) {
      console.error(`  ❌ Failed to fetch Rajya Sabha: ${e.message}`);
    }
  }

  await browser.close();

  // ─── INSERT TO DB ─────────────────────────────────────────
  if (allResults.length > 0) {
    console.log("\n💾 Inserting records to MongoDB...");
    let imported = 0;
    for (const m of allResults) {
      const slug = toSlug(m.name);
      await Politician.updateOne(
        { slug },
        {
          $set: {
            ...m,
            slug,
            party: toSlug(m.partyName),
            sourceUrl: "https://sansad.in",
            sourceVerifiedOn: new Date(),
            status: "Active",
          }
        },
        { upsert: true }
      );
      imported++;
      if (imported % 100 === 0) console.log(`  ... ${imported} / ${allResults.length} imported`);
    }
    console.log(`\n✅ Successfully synced ${imported} records!`);
  } else {
    console.log("\n⚠️  No records were extracted. Database remains unchanged.");
  }
}

main().catch(console.error).finally(() => process.exit(0));

main().catch(console.error).finally(() => process.exit(0));
