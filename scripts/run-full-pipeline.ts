import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { execSync } from "child_process";

function run(command: string) {
  console.log(`\n▶ ${command}`);
  execSync(command, { stdio: "inherit" });
}

function main() {
  console.log("🚀 Starting SattaDarshan full data pipeline");
  run("node scripts/scrape-all-mps.cjs");
  run("npx tsx scripts/seed-from-raw.ts");
  run("npx tsx scripts/seed-current-leadership.ts");
  run("npx tsx scripts/enrich-politician-profiles.ts");
  run("npx tsx scripts/count-politicians.ts");
  console.log("\n✅ Full data pipeline finished");
}

main();
