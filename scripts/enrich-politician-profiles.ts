import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import connectDB from "../lib/db";
import Politician from "../models/Politician";

type WikiSummary = {
  thumbnail?: { source?: string };
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getSummary(title: string): Promise<WikiSummary | null> {
  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  try {
    const res = await fetch(endpoint, {
      headers: { "User-Agent": "SattaDarshan/1.0 (contact@sattadarshan.in)" },
    });
    if (!res.ok) return null;
    return (await res.json()) as WikiSummary;
  } catch {
    return null;
  }
}

async function main() {
  await connectDB();

  const candidates = await Politician.find({
    $or: [
      { photo: { $exists: false } },
      { photo: "" },
      { bio: { $exists: false } },
      { bio: "" },
    ],
  })
    .select("slug name photo bio")
    .lean();

  let updated = 0;
  let attempted = 0;

  for (const p of candidates) {
    attempted++;
    const cleanName = String(p.name).replace(/^(Shri|Smt\.|Smt|Dr\.|Dr|Prof\.|Prof|Sushri|Kum\.|Kum|Ms\.|Ms|Mr\.|Mr)\s+/gi, '').replace(/\s+\(.*\)$/, '').trim();
    const summary = await getSummary(cleanName);
    if (!summary) continue;

    const nextPhoto = summary.thumbnail?.source || (p as any).photo || "";
    const nextBio = summary.extract || (p as any).bio || "";
    const pageUrl = summary.content_urls?.desktop?.page || "";

    const setPayload: Record<string, string> = {};
    if (!(p as any).photo && nextPhoto) setPayload.photo = nextPhoto;
    if (!(p as any).bio && nextBio) setPayload.bio = nextBio;
    if (pageUrl) setPayload["socialLinks.website"] = pageUrl;
    if (Object.keys(setPayload).length === 0) continue;

    await Politician.updateOne({ slug: p.slug }, { $set: setPayload });
    updated++;

    if (updated % 25 === 0) console.log(`... ${updated} profiles enriched`);
    await sleep(120);
  }

  console.log(`✅ Profile enrichment complete: ${updated} updated of ${attempted} checked`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
