import { ImageResponse } from "next/og";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import State from "@/models/State";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ type: string; slug: string }> }) {
  let category = "CIVIC DIRECTORY";
  let title = "SattaDarshan";
  let subtitle = "Independent Political & Legislative Platform";
  let badge = "PUBLIC RECORD";
  let meta1 = "18th Lok Sabha & Rajya Sabha";
  let meta2 = "36 States & UTs";
  let meta3 = "Verified Civic Data";

  try {
    await connectDB();
    const resolvedParams = await params;
    const type = resolvedParams.type?.toLowerCase();
    const slug = resolvedParams.slug;

    if (type === "politician") {
      category = "REPRESENTATIVE PROFILE";
      const p = await Politician.findOne({ slug }).lean() as any;
      if (p) {
        title = p.name || title;
        badge = p.ministerialRank || (p.role === "Minister" ? "Cabinet Minister" : p.role) || "Representative";
        subtitle = p.currentOffice || p.role || "Member of Parliament";
        meta1 = p.partyName || "Independent";
        meta2 = p.chamber || (p.role === "CM" ? "State Assembly" : "Parliament");
        meta3 = p.constituency ? `${p.constituency}, ${p.state}` : p.state || "India";
      }
    } else if (type === "party") {
      category = "POLITICAL PARTY";
      const p = await Party.findOne({ slug }).lean() as any;
      if (p) {
        title = p.name || title;
        badge = p.abbr ? `${p.abbr} • Political Party` : "Political Party";
        subtitle = p.alliance ? `${p.alliance} Coalition` : "Recognized Political Party";
        meta1 = p.seats ? `${p.seats} Lok Sabha Seats` : "Indian Parliament";
        meta2 = p.rulingStates?.length ? `Governing in ${p.rulingStates.length} States` : "National Representation";
        meta3 = p.foundedYear ? `Est. ${p.foundedYear}` : "Election Commission of India";
      }
    } else if (type === "state") {
      category = "STATE JURISDICTION";
      const s = await State.findOne({ slug }).lean() as any;
      if (s) {
        title = s.name || title;
        badge = s.region ? `${s.region} Region` : "State / UT";
        subtitle = s.cm ? `Chief Minister: ${s.cm}` : "Union Territory Administration";
        meta1 = s.rulingParty ? `Ruling: ${s.rulingParty}` : "Central Administration";
        meta2 = `${s.totalAssemblySeats || 0} Assembly Seats`;
        meta3 = `${s.totalLokSabhaSeats || 0} Lok Sabha Seats`;
      }
    } else if (type === "parliament") {
      category = "PARLIAMENT CHAMBER";
      if (slug.includes("lok-sabha")) {
        title = "18th Lok Sabha";
        badge = "LOWER HOUSE";
        subtitle = "House of the People • Parliament of India";
        meta1 = "543 Parliamentary Seats";
        meta2 = "Direct Universal Suffrage";
        meta3 = "36 States & UTs Represented";
      } else if (slug.includes("rajya-sabha")) {
        title = "Rajya Sabha";
        badge = "UPPER HOUSE";
        subtitle = "Council of States • Parliament of India";
        meta1 = "245 Parliamentary Seats";
        meta2 = "Permanent House";
        meta3 = "State Legislative Representation";
      }
    }
  } catch {
    // Graceful fallback to default civic card branding without leaking internal exceptions
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F8FAFC",
          padding: "48px 56px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top Tricolor Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            display: "flex",
          }}
        >
          <div style={{ flex: 1, backgroundColor: "#FF9933" }} />
          <div style={{ flex: 1, backgroundColor: "#CBD5E1" }} />
          <div style={{ flex: 1, backgroundColor: "#138808" }} />
        </div>

        {/* Main Inner White Card */}
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            border: "1.5px solid #E2E8F0",
            padding: "40px 48px",
            boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)",
          }}
        >
          {/* Top Brand Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1.5px solid #F1F5F9",
              paddingBottom: 24,
            }}
          >
            {/* Logo + Name */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Parliament Emblem Icon SVG */}
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  backgroundColor: "#F1F5F9",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="22" x2="21" y2="22" />
                  <line x1="6" y1="18" x2="6" y2="11" />
                  <line x1="10" y1="18" x2="10" y2="11" />
                  <line x1="14" y1="18" x2="14" y2="11" />
                  <line x1="18" y1="18" x2="18" y2="11" />
                  <polygon points="12 2 20 7 4 7" />
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#0F172A",
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                  }}
                >
                  Satta<span style={{ color: "#F59E0B" }}>Darshan</span>
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748B",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginTop: 4,
                  }}
                >
                  Independent Civic Platform
                </span>
              </div>
            </div>

            {/* Category / Notice Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#FEF3C7",
                border: "1px solid #FDE68A",
                padding: "8px 16px",
                borderRadius: 9999,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#B45309",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {category}
              </span>
            </div>
          </div>

          {/* Central Title & Office Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "24px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#2563EB",
                  backgroundColor: "#EFF6FF",
                  border: "1px solid #DBEAFE",
                  padding: "4px 12px",
                  borderRadius: 8,
                  textTransform: "uppercase",
                }}
              >
                {badge}
              </span>
            </div>

            <div
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#0F172A",
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#D97706",
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom Meta Pill Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1.5px solid #F1F5F9",
              paddingTop: 24,
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  padding: "10px 18px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                {meta1}
              </div>
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  padding: "10px 18px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                {meta2}
              </div>
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  padding: "10px 18px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                {meta3}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
