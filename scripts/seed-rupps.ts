import "dotenv/config";
import fs from "fs";
import path from "path";
import { connectDB } from "../lib/db";
import Party from "../models/Party";

function deriveState(address: string): string {
  const addr = address.toUpperCase();
  const stateMap: [string[], string][] = [
    [["UTTAR PRADESH","LUCKNOW","KANPUR","AGRA","VARANASI","ALLAHABAD","PRAYAGRAJ"], "uttar-pradesh"],
    [["MAHARASHTRA","MUMBAI","PUNE","NAGPUR","NASHIK"], "maharashtra"],
    [["DELHI","NEW DELHI"], "delhi"],
    [["BIHAR","PATNA","MUZAFFARPUR","GAYA"], "bihar"],
    [["WEST BENGAL","KOLKATA","HOWRAH"], "west-bengal"],
    [["TAMIL NADU","CHENNAI","COIMBATORE","MADURAI"], "tamil-nadu"],
    [["KARNATAKA","BENGALURU","BANGALORE","MYSURU","MYSORE"], "karnataka"],
    [["ANDHRA PRADESH","HYDERABAD","VIJAYAWADA","VISAKHAPATNAM"], "andhra-pradesh"],
    [["TELANGANA","HYDERABAD","WARANGAL"], "telangana"],
    [["GUJARAT","AHMEDABAD","SURAT","VADODARA","RAJKOT"], "gujarat"],
    [["RAJASTHAN","JAIPUR","JODHPUR","UDAIPUR","KOTA"], "rajasthan"],
    [["MADHYA PRADESH","BHOPAL","INDORE","JABALPUR"], "madhya-pradesh"],
    [["KERALA","THIRUVANANTHAPURAM","KOCHI","KOZHIKODE"], "kerala"],
    [["PUNJAB","CHANDIGARH","AMRITSAR","LUDHIANA"], "punjab"],
    [["HARYANA","GURGAON","GURUGRAM","FARIDABAD","ROHTAK"], "haryana"],
    [["JHARKHAND","RANCHI","DHANBAD","JAMSHEDPUR"], "jharkhand"],
    [["ODISHA","BHUBANESWAR","CUTTACK","ROURKELA"], "odisha"],
    [["ASSAM","GUWAHATI","DISPUR"], "assam"],
    [["CHHATTISGARH","RAIPUR","BILASPUR"], "chhattisgarh"],
    [["UTTARAKHAND","DEHRADUN","HARIDWAR","ROORKEE"], "uttarakhand"],
    [["HIMACHAL PRADESH","SHIMLA","DHARAMSALA"], "himachal-pradesh"],
    [["JAMMU","KASHMIR","SRINAGAR"], "jammu-kashmir"],
    [["GOA","PANAJI","MARGAO"], "goa"],
    [["MANIPUR","IMPHAL"], "manipur"],
    [["MEGHALAYA","SHILLONG"], "meghalaya"],
    [["MIZORAM","AIZAWL"], "mizoram"],
    [["NAGALAND","KOHIMA","DIMAPUR"], "nagaland"],
    [["TRIPURA","AGARTALA"], "tripura"],
    [["SIKKIM","GANGTOK"], "sikkim"],
    [["ARUNACHAL","ITANAGAR"], "arunachal-pradesh"],
    [["PUDUCHERRY","PONDICHERRY"], "puducherry"],
  ];
  for (const [keywords, slug] of stateMap) {
    if (keywords.some(k => addr.includes(k))) return slug;
  }
  return "unknown";
}

function toSlug(name: string, index: number): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + index;
}

async function main() {
  await connectDB();
  const jsonPath = path.join(process.cwd(), "rupps_india.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("❌ rupps_india.json not found in project root!");
    console.error("   Please place the file there and re-run.");
    process.exit(1);
  }
  const rupps = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`📦 Loaded ${rupps.length} RUPPs from JSON`);
  let added = 0, skipped = 0, errors = 0;
  for (let i = 0; i < rupps.length; i++) {
    const rupp = rupps[i];
    const slug = toSlug(rupp.name || `rupp-${i}`, i);
    try {
      const exists = await Party.findOne({ slug });
      if (exists) { skipped++; continue; }
      const state = deriveState(rupp.headquartersAddress || "");
      await Party.create({
        slug, name: rupp.name, tier: "RUPP",
        status: rupp.status === "Delisted" ? "Delisted" : rupp.status === "Inactive" ? "Inactive" : "Active",
        headquartersAddress: rupp.headquartersAddress,
        pincode: rupp.pincode, state,
      });
      added++;
      if (added % 100 === 0) console.log(`  ${added} RUPPs added...`);
    } catch (e) { errors++; }
  }
  console.log(`✅ RUPPs: ${added} added, ${skipped} skipped, ${errors} errors`);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
