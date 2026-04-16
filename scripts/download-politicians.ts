import fs from "fs";
import path from "path";
import "dotenv/config";
import sharp from "sharp";
import connectDB from "../lib/db";
import Politician from "../models/Politician";

const OUT_DIR = path.join(process.cwd(), "public", "politicians");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function createFallback(slug: string, initials: string) {
  const finalFile = path.join(OUT_DIR, `${slug}.webp`);
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f3f4f6" />
      <text x="100" y="115" font-family="-apple-system, sans-serif" font-size="64" font-weight="bold" fill="#9ca3af" text-anchor="middle">${initials}</text>
    </svg>
  `;
  try { await sharp(Buffer.from(svg)).webp().toFile(finalFile); } catch (e) { }
}

async function main() {
  await connectDB();
  const ps = await Politician.find({ photo: { $regex: /^https:/ } }).lean();
  console.log(`Starting image migration for ${ps.length} politicians...`);

  let successes = 0;
  let failures = 0;
  let skipped = 0;

  for (let i = 0; i < ps.length; i++) {
     const p = ps[i] as any;
     const newPhotoPath = `/politicians/${p.slug}.webp`;
     const finalFile = path.join(OUT_DIR, `${p.slug}.webp`);
     
     // Skip if already converted
     if (fs.existsSync(finalFile)) {
         if ((p.photo) !== newPhotoPath) {
             await Politician.updateOne({ _id: p._id }, { photo: newPhotoPath });
         }
         skipped++;
         continue;
     }

     const parts = (p.photo as string).split('/');
     const filename = decodeURIComponent(parts[parts.length - 1]);
     const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
     
     let success = false;
     try {
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0" },
          redirect: 'follow'
        });
        
        if (res.ok) {
           const buffer = Buffer.from(await res.arrayBuffer());
           await sharp(buffer)
             .resize(300, 300, { fit: "cover", position: "top" })
             .webp({ quality: 80 })
             .toFile(finalFile);
           success = true;
           successes++;
           process.stdout.write("✅ ");
        } else {
           failures++;
           process.stdout.write("❌ ");
        }
     } catch (e) { 
        failures++; 
        process.stdout.write("❌ ");
     }
     
     if (!success) {
         const initials = p.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
         await createFallback(p.slug, initials);
     }
     
     await Politician.updateOne({ _id: p._id }, { photo: newPhotoPath });
     
     if (success) {
        await new Promise(r => setTimeout(r, 400));
     } else {
        await new Promise(r => setTimeout(r, 50));
     }

     if ((i + 1) % 50 === 0) console.log(`\nProcessed ${i + 1}/${ps.length}`);
  }
  
  console.log(`\nMigration complete. Skipped: ${skipped}, Successes: ${successes}, Fallbacks generated: ${failures}`);

  // One final sweep to fix any leftover URLs that might have been skipped/missing initially
  const anyLeftovers = await Politician.find({ photo: { $regex: /^https:/ } }).lean();
  for (const left of anyLeftovers) {
       const initials = (left as any).name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
       await createFallback((left as any).slug, initials);
       await Politician.updateOne({ _id: left._id }, { photo: `/politicians/${(left as any).slug}.webp` });
  }
}

main().catch(console.error).finally(()=>process.exit(0));
