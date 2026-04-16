import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUT_DIR = path.join(process.cwd(), "public", "flags");

async function downloadLogo(slug: string, fileName: string) {
  const finalFile = path.join(OUT_DIR, `${slug}.png`);
  
  if (fs.existsSync(finalFile)) {
     const stat = fs.statSync(finalFile);
     if (stat.size > 5000) return false;
  }
  
  try {
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*"
      },
      redirect: 'follow'
    });
    
    if (res.status === 429) {
      console.error(`❌ HTTP 429 Too Many Requests for ${slug}`);
      return false;
    }
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    
    await sharp(buffer)
      .resize(200, 200, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(finalFile);
      
    console.log(`✅ Downloaded: ${slug}.png`);
    return true; 
  } catch (error) {
    console.error(`❌ Failed ${slug}: ${error}`);
    await createFallback(slug, slug.substring(0, 3).toUpperCase());
    return false;
  }
}

async function createFallback(slug: string, text: string) {
  const finalFile = path.join(OUT_DIR, `${slug}.png`);
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f3f4f6" rx="20"/>
      <text x="100" y="115" font-family="-apple-system, sans-serif" font-size="64" font-weight="bold" fill="#9ca3af" text-anchor="middle">${text}</text>
    </svg>
  `;
  try { await sharp(Buffer.from(svg)).png().toFile(finalFile); } catch (e) { }
}

async function main() {
  const rawPath = path.join(process.cwd(), "data", "parties_raw.json");
  const PARTIES = JSON.parse(fs.readFileSync(rawPath, "utf8"));
  let fetchCount = 0;
  for (const party of PARTIES) {
    if (party.logoFile) {
      const grabbed = await downloadLogo(party.slug, party.logoFile);
      if (grabbed) {
          fetchCount++;
          await new Promise(r => setTimeout(r, 6000)); // 6 second delay to absolutely avoid 429
      }
    }
  }
  console.log(`Finished checking remaining logos. Fetched ${fetchCount}`);
}
main();
