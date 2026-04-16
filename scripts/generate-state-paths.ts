import fs from "fs";
import { geoMercator, geoPath } from "d3-geo";

const aliases: Record<string, string> = {
  "uttaranchal": "uttarakhand",
  "orissa": "odisha",
  "telengana": "telangana",
  "nct of delhi": "delhi"
};

async function generate() {
  const geoUrl = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";
  const req = await fetch(geoUrl);
  const geojson = await req.json();

  const out: Record<string, string> = {};

  for (const feature of geojson.features) {
    let name = String(feature.properties.NAME_1 || "").toLowerCase();
    if (aliases[name]) name = aliases[name];

    // Create a projection specifically scaled to fit this feature inside 100x100
    const projection = geoMercator().fitSize([100, 100], feature);
    const pathGenerator = geoPath().projection(projection);
    
    const svgPath = pathGenerator(feature);
    if (svgPath) out[name] = svgPath;
  }

  // Handle aliases like dadra and nagar haveli
  const tsContent = `export const statePaths: Record<string, string> = ${JSON.stringify(out, null, 2)};\n`;
  const outDir = "components/ui";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(`${outDir}/statePaths.ts`, tsContent);
  console.log("State paths generated at components/ui/statePaths.ts");
}

generate().catch(console.error);
