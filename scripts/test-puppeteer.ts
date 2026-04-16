import puppeteer from "puppeteer";
import fs from "fs";

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Fake User-Agent to avoid immediate block
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36");
  
  console.log("Navigating to Lok Sabha...");
  await page.goto("https://sansad.in/ls/members", { waitUntil: "networkidle2" });
  
  // Get all visible text to understand the DOM structure
  const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log(text);
  
  await browser.close();
}

main().catch(console.error);
