import fs from "fs";
import path from "path";
import sharp from "sharp";

const FALLBACKS = [
  { slug: "ncp", text: "NCP" },
  { slug: "sp", text: "SP" },
  { slug: "dmk", text: "DMK" },
  { slug: "shiv-sena", text: "SS" },
];

const OUT_DIR = path.join(process.cwd(), "public", "flags");

async function createFallback(slug: string, text: string) {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f3f4f6" rx="20"/>
      <text x="100" y="115" font-family="-apple-system, sans-serif" font-size="64" font-weight="bold" fill="#9ca3af" text-anchor="middle">${text}</text>
    </svg>
  `;
  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(OUT_DIR, `${slug}.png`));
    console.log(`✅ Created fallback for: ${slug}.png`);
  } catch (error) {
    console.error(`❌ Failed to process ${slug}: ${error}`);
  }
}

async function main() {
  for (const party of FALLBACKS) {
    const file = path.join(OUT_DIR, `${party.slug}.png`);
    if (!fs.existsSync(file)) {
      await createFallback(party.slug, party.text);
    }
  }
}

main().catch(console.error);
