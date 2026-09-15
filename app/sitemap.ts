import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://sattadarshan.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/parliament/lok-sabha",
    "/parliament/rajya-sabha",
    "/politicians",
    "/parties",
    "/states",
    "/compare",
    "/map",
  ];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: p === "/" ? 1 : 0.7,
  }));
}
