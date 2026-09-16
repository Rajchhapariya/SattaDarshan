import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive India Political & Parliamentary Map — SattaDarshan",
  description:
    "Interactive SVG map of India displaying state-by-state political governance, ruling coalitions, Lok Sabha seats, and Vidhan Sabha assemblies.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/map",
  },
  openGraph: {
    title: "Interactive India Political Map — SattaDarshan",
    description:
      "Interactive SVG map of India displaying state-by-state political governance, ruling coalitions, Lok Sabha seats, and Vidhan Sabha assemblies.",
    url: "https://satta-darshan-7jgo.vercel.app/map",
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
