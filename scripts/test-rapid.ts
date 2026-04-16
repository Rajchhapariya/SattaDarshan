import "dotenv/config";
import connectDB from "../lib/db";
import Politician from "../models/Politician";
import fs from "fs";
import path from "path";

async function main() {
  await connectDB();
  const ps = await Politician.find({ photo: { $regex: /^https:/ } }).lean();
  let successes = 0;
  let failures = 0;
  
  for (const p of ps.slice(0, 5)) {
     try {
        const parts = (p.photo as string).split('/');
        const filename = decodeURIComponent(parts[parts.length - 1]);
        const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
        
        console.log("Fetching:", url);
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0" },
          redirect: 'follow'
        });
        
        if (res.ok) {
           const size = (await res.arrayBuffer()).byteLength;
           console.log("Success! File size:", size);
           successes++;
        } else {
           console.log("Failed:", res.status, res.statusText);
           failures++;
        }
     } catch (e) { failures++; }
  }
  console.log(`Rapid test completed: ${successes} success, ${failures} failures.`);
}

main().catch(console.error).finally(()=>process.exit(0));
