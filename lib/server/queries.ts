import { cache } from "react";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import State from "@/models/State";
import { escapeRegex } from "@/lib/utils";

/**
 * React cache()-deduplicated server queries for Next.js App Router.
 * Deduplicates database queries within a single render pass (e.g. between generateMetadata and Page).
 */

export const getPoliticianBySlug = cache(async (slug: string) => {
  await connectDB();
  const p = (await Politician.findOne({ slug }).lean()) as any;
  if (!p) return null;

  if (p.party) {
    const party = (await Party.findOne({ slug: p.party }).lean()) as any;
    if (party) {
      p.partyName = party.name;
      p.partyLogo = party.logo;
      p.partyAbbr = party.abbr;
    }
  }
  return JSON.parse(JSON.stringify(p));
});

export const getPartyBySlug = cache(async (slug: string) => {
  try {
    await connectDB();
    const party = (await Party.findOne({ slug }).lean()) as any;
    if (!party) return null;

    // Search for MPs belonging to this party by slug or abbreviation
    const leaders = await Politician.find({
      $or: [
        { party: slug },
        { party: party.abbr?.toLowerCase() },
        { partyName: party.name },
        { partyName: party.abbr },
      ],
    })
      .sort({ role: 1, name: 1 })
      .limit(24)
      .lean();

    return JSON.parse(JSON.stringify({ ...party, leaders }));
  } catch {
    return null;
  }
});

const STATE_ALIASES: Record<string, string> = {
  "andaman-and-nicobar-islands": "andaman-nicobar",
  "andaman-and-nicobar": "andaman-nicobar",
  "andaman-nicobar-islands": "andaman-nicobar",
  "dadra-and-nagar-haveli": "dadra-nagar-haveli",
  "dadra-and-nagar-haveli-and-daman-and-diu": "dadra-nagar-haveli",
  "daman-and-diu": "dadra-nagar-haveli",
  "daman-diu": "dadra-nagar-haveli",
  "jammu-and-kashmir": "jammu-kashmir",
  "nct-of-delhi": "delhi",
  "national-capital-territory-of-delhi": "delhi",
  "telengana": "telangana",
  "orissa": "odisha",
  "uttaranchal": "uttarakhand",
  "pondicherry": "puducherry",
};

export const getStateBySlug = cache(async (slug: string) => {
  try {
    await connectDB();
    const normalizedSlug = STATE_ALIASES[slug.toLowerCase()] || slug.toLowerCase();

    // 1. Direct slug match
    let s = await State.findOne({ slug: normalizedSlug }).lean();
    if (s) return JSON.parse(JSON.stringify(s));

    // 2. Try raw slug
    s = await State.findOne({ slug }).lean();
    if (s) return JSON.parse(JSON.stringify(s));

    // 3. Try matching by name regex
    const clean = normalizedSlug.replace(/-/g, " ");
    const pattern = clean
      .replace(/\band\b/g, "(&|and)")
      .replace(/\bplus\b/g, "\\+");
    const byName = await State.findOne({ name: new RegExp(`^${pattern}$`, "i") }).lean();
    if (byName) return JSON.parse(JSON.stringify(byName));

    // 4. Fuzzy search by contains
    const fuzzy = await State.findOne({ name: new RegExp(clean.split(" ")[0], "i") }).lean();
    return fuzzy ? JSON.parse(JSON.stringify(fuzzy)) : null;
  } catch {
    return null;
  }
});

export const getStatePoliticians = cache(async (stateName: string) => {
  await connectDB();
  const regex = new RegExp(`^${escapeRegex(stateName)}$`, "i");
  const list = await Politician.find({ state: regex }).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(list));
});
