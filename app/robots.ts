import { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://satta-darshan-7jgo.vercel.app";

export default function robots(): MetadataRoute.Robots {
  const privateEndpoints = [
    "/api/contact",
    "/api/corrections",
    "/api/newsletter",
    "/api/search",
    "/api/revalidate",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og/", "/api/media/"],
        disallow: privateEndpoints,
      },
      {
        userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "PerplexityBot"],
        allow: ["/", "/api/og/", "/api/media/"],
        disallow: privateEndpoints,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
