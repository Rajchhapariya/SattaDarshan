import fs from "fs";
import path from "path";
import sharp from "sharp";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import connectDB from "../lib/db";
import Politician from "../models/Politician";

const OUT_DIR = path.join(process.cwd(), "public", "politicians");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const CANONICAL_LEADERS: Array<{ slug: string; search: string; name: string; role?: string }> = [
  // National Leadership & Cabinet
  { slug: "narendra-modi", search: "Narendra_Modi", name: "Narendra Modi", role: "PM" },
  { slug: "rahul-gandhi", search: "Rahul_Gandhi", name: "Rahul Gandhi", role: "Leader of Opposition" },
  { slug: "amit-shah", search: "Amit_Shah", name: "Amit Shah", role: "Minister" },
  { slug: "rajnath-singh", search: "Rajnath_Singh", name: "Rajnath Singh", role: "Minister" },
  { slug: "s-jaishankar", search: "S._Jaishankar", name: "S. Jaishankar", role: "Minister" },
  { slug: "nirmala-sitharaman", search: "Nirmala_Sitharaman", name: "Nirmala Sitharaman", role: "Minister" },
  { slug: "nitin-gadkari", search: "Nitin_Gadkari", name: "Nitin Gadkari", role: "Minister" },
  { slug: "mallikarjun-kharge", search: "Mallikarjun_Kharge", name: "Mallikarjun Kharge", role: "Leader" },
  { slug: "akhilesh-yadav", search: "Akhilesh_Yadav", name: "Akhilesh Yadav", role: "Leader" },
  { slug: "arvind-kejriwal", search: "Arvind_Kejriwal", name: "Arvind Kejriwal", role: "Leader" },
  { slug: "shashi-tharoor", search: "Shashi_Tharoor", name: "Shashi Tharoor", role: "MP" },
  { slug: "mahua-moitra", search: "Mahua_Moitra", name: "Mahua Moitra", role: "MP" },
  { slug: "asaduddin-owaisi", search: "Asaduddin_Owaisi", name: "Asaduddin Owaisi", role: "MP" },
  { slug: "chirag-paswan", search: "Chirag_Paswan", name: "Chirag Paswan", role: "Minister" },
  { slug: "jp-nadda", search: "J._P._Nadda", name: "J. P. Nadda", role: "Minister" },
  { slug: "piyush-goyal", search: "Piyush_Goyal", name: "Piyush Goyal", role: "Minister" },
  { slug: "dharmendra-pradhan", search: "Dharmendra_Pradhan", name: "Dharmendra Pradhan", role: "Minister" },
  { slug: "kiren-rijiju", search: "Kiren_Rijiju", name: "Kiren Rijiju", role: "Minister" },
  { slug: "jyotiraditya-scindia", search: "Jyotiraditya_Scindia", name: "Jyotiraditya Scindia", role: "Minister" },
  { slug: "manohar-lal-khattar", search: "Manohar_Lal_Khattar", name: "Manohar Lal Khattar", role: "Minister" },
  { slug: "shivraj-singh-chauhan", search: "Shivraj_Singh_Chouhan", name: "Shivraj Singh Chouhan", role: "Minister" },
  { slug: "h-d-kumaraswamy", search: "H._D._Kumaraswamy", name: "H. D. Kumaraswamy", role: "Minister" },
  { slug: "jitan-ram-manjhi", search: "Jitan_Ram_Manjhi", name: "Jitan Ram Manjhi", role: "Minister" },
  { slug: "kinjarapu-ram-mohan-naidu", search: "Ram_Mohan_Naidu_Kinjarapu", name: "Kinjarapu Ram Mohan Naidu", role: "Minister" },
  { slug: "giriraj-singh", search: "Giriraj_Singh", name: "Giriraj Singh", role: "Minister" },
  { slug: "bhupender-yadav", search: "Bhupender_Yadav", name: "Bhupender Yadav", role: "Minister" },
  { slug: "gajendra-singh-shekhawat", search: "Gajendra_Singh_Shekhawat", name: "Gajendra Singh Shekhawat", role: "Minister" },
  { slug: "annpurna-devi", search: "Annpurna_Devi", name: "Annpurna Devi", role: "Minister" },
  { slug: "om-birla", search: "Om_Birla", name: "Om Birla", role: "Speaker" },
  { slug: "supriya-sule", search: "Supriya_Sule", name: "Supriya Sule", role: "MP" },
  { slug: "dimple-yadav", search: "Dimple_Yadav", name: "Dimple Yadav", role: "MP" },
  { slug: "kanimozhi-karunanidhi", search: "Kanimozhi_Karunanidhi", name: "Kanimozhi Karunanidhi", role: "MP" },
  { slug: "dayanidhi-maran", search: "Dayanidhi_Maran", name: "Dayanidhi Maran", role: "MP" },
  { slug: "a-raja", search: "A._Raja", name: "A. Raja", role: "MP" },
  { slug: "shri-raja-a", search: "A._Raja", name: "Shri Raja A", role: "MP" },
  { slug: "priyanka-gandhi-vadra", search: "Priyanka_Gandhi", name: "Priyanka Gandhi Vadra", role: "MP" },
  { slug: "tejashwi-yadav", search: "Tejashwi_Yadav", name: "Tejashwi Yadav", role: "Leader" },
  { slug: "sachin-pilot", search: "Sachin_Pilot", name: "Sachin Pilot", role: "Leader" },
  { slug: "tejasvi-surya", search: "Tejasvi_Surya", name: "Tejasvi Surya", role: "MP" },
  { slug: "kangana-ranaut", search: "Kangana_Ranaut", name: "Kangana Ranaut", role: "MP" },
  { slug: "chandrashekhar-azad", search: "Chandrashekhar_Azad_Ravan", name: "Chandrashekhar Azad", role: "MP" },
  { slug: "yusuf-pathan", search: "Yusuf_Pathan", name: "Yusuf Pathan", role: "MP" },
  { slug: "hema-malini", search: "Hema_Malini", name: "Hema Malini", role: "MP" },
  { slug: "bansuri-swaraj", search: "Bansuri_Swaraj", name: "Bansuri Swaraj", role: "MP" },
  { slug: "deepender-singh-hooda", search: "Deepender_Singh_Hooda", name: "Deepender Singh Hooda", role: "MP" },

  // All 31 State & UT Chief Ministers
  { slug: "n-chandrababu-naidu", search: "N._Chandrababu_Naidu", name: "N. Chandrababu Naidu", role: "CM" },
  { slug: "pema-khandu", search: "Pema_Khandu", name: "Pema Khandu", role: "CM" },
  { slug: "himanta-biswa-sarma", search: "Himanta_Biswa_Sarma", name: "Himanta Biswa Sarma", role: "CM" },
  { slug: "nitish-kumar", search: "Nitish_Kumar", name: "Nitish Kumar", role: "CM" },
  { slug: "vishnu-deo-sai", search: "Vishnu_Deo_Sai", name: "Vishnu Deo Sai", role: "CM" },
  { slug: "atishi", search: "Atishi_Marlena", name: "Atishi", role: "CM" },
  { slug: "pramod-sawant", search: "Pramod_Sawant", name: "Pramod Sawant", role: "CM" },
  { slug: "bhupendrabhai-patel", search: "Bhupendrabhai_Patel", name: "Bhupendrabhai Patel", role: "CM" },
  { slug: "nayab-singh-saini", search: "Nayab_Singh_Saini", name: "Nayab Singh Saini", role: "CM" },
  { slug: "sukhvinder-singh-sukhu", search: "Sukhvinder_Singh_Sukhu", name: "Sukhvinder Singh Sukhu", role: "CM" },
  { slug: "omar-abdullah", search: "Omar_Abdullah", name: "Omar Abdullah", role: "CM" },
  { slug: "hemant-soren", search: "Hemant_Soren", name: "Hemant Soren", role: "CM" },
  { slug: "siddaramaiah", search: "Siddaramaiah", name: "Siddaramaiah", role: "CM" },
  { slug: "pinarayi-vijayan", search: "Pinarayi_Vijayan", name: "Pinarayi Vijayan", role: "CM" },
  { slug: "mohan-yadav", search: "Mohan_Yadav", name: "Mohan Yadav", role: "CM" },
  { slug: "devendra-fadnavis", search: "Devendra_Fadnavis", name: "Devendra Fadnavis", role: "CM" },
  { slug: "n-biren-singh", search: "N._Biren_Singh", name: "N. Biren Singh", role: "CM" },
  { slug: "conrad-sangma", search: "Conrad_Sangma", name: "Conrad Sangma", role: "CM" },
  { slug: "lalduhoma", search: "Lalduhoma", name: "Lalduhoma", role: "CM" },
  { slug: "neiphiu-rio", search: "Neiphiu_Rio", name: "Neiphiu Rio", role: "CM" },
  { slug: "mohan-charan-majhi", search: "Mohan_Charan_Majhi", name: "Mohan Charan Majhi", role: "CM" },
  { slug: "n-rangasamy", search: "N._Rangasamy", name: "N. Rangasamy", role: "CM" },
  { slug: "bhagwant-mann", search: "Bhagwant_Mann", name: "Bhagwant Mann", role: "CM" },
  { slug: "bhajan-lal-sharma", search: "Bhajan_Lal_Sharma", name: "Bhajan Lal Sharma", role: "CM" },
  { slug: "prem-singh-tamang", search: "Prem_Singh_Tamang", name: "Prem Singh Tamang", role: "CM" },
  { slug: "m-k-stalin", search: "M._K._Stalin", name: "M. K. Stalin", role: "CM" },
  { slug: "revanth-reddy", search: "Revanth_Reddy", name: "Revanth Reddy", role: "CM" },
  { slug: "manik-saha", search: "Manik_Saha", name: "Manik Saha", role: "CM" },
  { slug: "yogi-adityanath", search: "Yogi_Adityanath", name: "Yogi Adityanath", role: "CM" },
  { slug: "pushkar-singh-dhami", search: "Pushkar_Singh_Dhami", name: "Pushkar Singh Dhami", role: "CM" },
  { slug: "mamata-banerjee", search: "Mamata_Banerjee", name: "Mamata Banerjee", role: "CM" },
];

async function fetchWikiThumbnail(title: string): Promise<string | null> {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
      headers: { "User-Agent": "SattaDarshan/1.0 (civic-portal@sattadarshan.in)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail?.source || null;
  } catch {
    return null;
  }
}

async function downloadAndOptimize(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    
    // Resize to max 320x320, WebP 80% quality (compact ~15KB each)
    await sharp(buffer)
      .resize(320, 320, { fit: "cover", position: "top" })
      .webp({ quality: 80, effort: 4 })
      .toFile(destPath);
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  await connectDB();
  console.log("Starting lightweight high-res portrait download and sync...");

  let localSaved = 0;
  let dbUpdated = 0;

  for (const item of CANONICAL_LEADERS) {
    const webpFilename = `${item.slug}.webp`;
    const localFile = path.join(OUT_DIR, webpFilename);
    const localWebPath = `/politicians/${webpFilename}`;

    let hasLocalImage = fs.existsSync(localFile) && fs.statSync(localFile).size > 1500;

    if (!hasLocalImage) {
      const thumbUrl = await fetchWikiThumbnail(item.search);
      if (thumbUrl) {
        const ok = await downloadAndOptimize(thumbUrl, localFile);
        if (ok) {
          hasLocalImage = true;
          localSaved++;
          const sizeKb = (fs.statSync(localFile).size / 1024).toFixed(1);
          console.log(`[SAVED] ${item.name} -> ${webpFilename} (${sizeKb} KB)`);
        }
      }
      await sleep(100);
    }

    if (hasLocalImage) {
      const updatePayload: Record<string, any> = { photo: localWebPath };
      if (item.role) updatePayload.role = item.role;
      
      const res = await Politician.updateMany(
        { $or: [{ slug: item.slug }, { name: item.name }] },
        { $set: updatePayload }
      );
      if (res.modifiedCount > 0) dbUpdated += res.modifiedCount;
    }
  }

  console.log(`Cached ${localSaved} new local portraits. Database updated for ${dbUpdated} records.`);

  // Fix all remaining MPs: remove broken 400 upload.wikimedia or ui-avatars URLs
  console.log("Cleaning up and enriching remaining MP profiles...");
  const brokenMps = await Politician.find({
    $or: [
      { photo: { $in: ["", null] } },
      { photo: { $regex: /upload\.wikimedia\.org/ } },
      { photo: { $regex: /ui-avatars\.com/ } },
    ],
  }).select("slug name constituency state chamber").lean();

  console.log(`Found ${brokenMps.length} MPs to verify.`);

  let enrichedCount = 0;
  for (let i = 0; i < brokenMps.length; i++) {
    const p = brokenMps[i];
    const cleanName = String(p.name)
      .replace(/^(Shri|Smt\.|Smt|Dr\.|Dr|Prof\.|Prof|Sushri|Kum\.|Kum|Ms\.|Ms|Mr\.|Mr|Thiru|Adv\.|Ch\.|Mohd\.)\s+/gi, "")
      .replace(/\s+\(.*\)$/, "")
      .trim();

    // Check if valid local file already exists
    const localFile = path.join(OUT_DIR, `${p.slug}.webp`);
    if (fs.existsSync(localFile) && fs.statSync(localFile).size > 1500) {
      await Politician.updateOne({ _id: p._id }, { photo: `/politicians/${p.slug}.webp` });
      enrichedCount++;
      continue;
    }

    let thumbUrl = await fetchWikiThumbnail(cleanName);
    if (!thumbUrl) {
      const parts = cleanName.split(" ");
      if (parts.length === 2 && parts[1].length === 1) {
        thumbUrl = await fetchWikiThumbnail(`${parts[1]}. ${parts[0]}`);
      }
    }
    if (!thumbUrl) {
      thumbUrl = await fetchWikiThumbnail(`${cleanName} (politician)`);
    }

    if (thumbUrl && thumbUrl.includes("thumb.wikimedia.org")) {
      // Store verified thumb.wikimedia.org URL (doesn't take any local disk storage)
      await Politician.updateOne({ _id: p._id }, { photo: thumbUrl });
      enrichedCount++;
    } else {
      // Empty string cleanly delegates to our new dignified CivicAvatar fallback
      await Politician.updateOne({ _id: p._id }, { photo: "" });
    }

    if ((i + 1) % 50 === 0) {
      console.log(`... checked ${i + 1}/${brokenMps.length} MPs (enriched: ${enrichedCount})`);
    }
    await sleep(80);
  }

  console.log(`Synchronization complete! Enriched: ${enrichedCount} of ${brokenMps.length}.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
