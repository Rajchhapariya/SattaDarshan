import type { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import State from "@/models/State";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://satta-darshan-7jgo.vercel.app";

export const revalidate = 86400; // Cache sitemap for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0, changeFrequency: "daily", lastModified: new Date() },
    { url: `${base}/parliament/lok-sabha`, priority: 0.9, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/parliament/rajya-sabha`, priority: 0.9, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/politicians`, priority: 0.8, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/parties`, priority: 0.8, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/states`, priority: 0.8, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/compare`, priority: 0.7, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${base}/map`, priority: 0.7, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/disclaimer`, priority: 0.5, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/methodology`, priority: 0.5, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/corrections`, priority: 0.6, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/privacy`, priority: 0.4, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/terms`, priority: 0.4, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${base}/contact`, priority: 0.4, changeFrequency: "monthly", lastModified: new Date() },
  ];

  try {
    await connectDB();

    const [politicians, parties, states] = await Promise.all([
      Politician.find({ slug: { $exists: true, $ne: "" } })
        .select("slug updatedAt lastVerifiedAt")
        .lean(),
      Party.find({ slug: { $exists: true, $ne: "" } })
        .select("slug updatedAt")
        .lean(),
      State.find({ slug: { $exists: true, $ne: "" } })
        .select("slug updatedAt")
        .lean(),
    ]);

    const politicianEntries: MetadataRoute.Sitemap = politicians
      .filter((p: any) => p.slug)
      .map((p: any) => ({
        url: `${base}/politicians/${p.slug}`,
        lastModified: p.updatedAt || p.lastVerifiedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    const partyEntries: MetadataRoute.Sitemap = parties
      .filter((p: any) => p.slug)
      .map((p: any) => ({
        url: `${base}/parties/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    const stateEntries: MetadataRoute.Sitemap = states
      .filter((s: any) => s.slug)
      .map((s: any) => ({
        url: `${base}/states/${s.slug}`,
        lastModified: s.updatedAt || new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));

    return [...staticPaths, ...politicianEntries, ...partyEntries, ...stateEntries];
  } catch {
    // Graceful fallback to static sitemap paths without dumping internal DB errors
    return staticPaths;
  }
}
