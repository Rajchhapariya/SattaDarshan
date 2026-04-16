import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://sansad.in/ls/members", { waitUntil: "networkidle2" });
  
  const sampleData = await page.evaluate(() => {
    const row = document.querySelector("table tbody tr");
    if (!row) return null;
    return {
       html: row.innerHTML,
       imgSrcs: Array.from(row.querySelectorAll("img")).map(img => img.src)
    }
  });

  console.log(sampleData);
  await browser.close();
}

main().catch(console.error).finally(() => process.exit(0));
