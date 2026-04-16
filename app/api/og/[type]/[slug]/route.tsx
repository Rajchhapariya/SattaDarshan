import { ImageResponse } from "next/og";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";

export async function GET(_: Request, { params }: { params: { type: string; slug: string } }) {
  let title = "SattaDarshan";
  let subtitle = "India's Political Transparency Platform";
  try {
    await connectDB();
    const resolvedParams = params;
    if (resolvedParams.type === "politician") {
      const p = await Politician.findOne({ slug: resolvedParams.slug }).lean();
      if (p) {
        title = String((p as any).name || title);
        subtitle = `${String((p as any).role || "Politician")} • ${String((p as any).partyName || "Independent")}`;
      }
    } else if (resolvedParams.type === "party") {
      const p = await Party.findOne({ slug: resolvedParams.slug }).lean();
      if (p) {
        title = String((p as any).name || title);
        subtitle = `Political Party • ${String((p as any).tier || "India")}`;
      }
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #111827 0%, #1e3a8a 55%, #f97316 100%)",
          padding: 48,
          color: "white",
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.9 }}>SattaDarshan</div>
        <div>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 30, marginTop: 16, opacity: 0.95 }}>{subtitle}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
