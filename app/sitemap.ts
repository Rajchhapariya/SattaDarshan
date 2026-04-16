import type { MetadataRoute } from "next";

const base = "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/politicians", "/parties", "/states", "/news", "/map", "/compare", "/timeline", "/admin/login"];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: p === "/" ? 1 : 0.7,
  }));
}
