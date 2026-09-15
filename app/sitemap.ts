import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://sattadarshan.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const mainPaths = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/parliament/lok-sabha", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/parliament/rajya-sabha", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/politicians", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/parties", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/states", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/compare", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/map", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const legalPaths = [
    { path: "/disclaimer", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/methodology", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/corrections", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.4, changeFrequency: "monthly" as const },
  ];

  return [...mainPaths, ...legalPaths].map((item) => ({
    url: `${base}${item.path}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
