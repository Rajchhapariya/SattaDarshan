import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geospatial Civic & Parliamentary Map of India",
  description:
    "Interactive state and union territory map of India displaying Lok Sabha seat allocations, Vidhan Sabha assemblies, and regional political representation.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/map",
  },
  openGraph: {
    title: "Geospatial Civic & Parliamentary Map of India — SattaDarshan",
    description:
      "Interactive state and union territory map of India displaying Lok Sabha seat allocations, Vidhan Sabha assemblies, and regional political representation.",
    url: "https://satta-darshan-7jgo.vercel.app/map",
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
