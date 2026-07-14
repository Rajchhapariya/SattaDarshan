import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://sattadarshan.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/politicians", "/parties", "/states", "/news", "/map", "/compare", "/timeline", "/admin/login"];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: p === "/" ? 1 : 0.7,
  }));
}
