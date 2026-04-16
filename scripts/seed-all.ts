import "dotenv/config";
import { execSync } from "child_process";
const scripts = ["seed-admin","seed-states","seed-parties","seed-politicians","seed-rupps"];
console.log("🌱 SattaDarshan — Full Seed\n");
for (const script of scripts) {
  console.log(`\n── Running ${script} ──`);
  //execSync(`npx tsx scripts/${script}.ts`, { stdio: "inherit" });
}
console.log("\n🎉 All seeds complete!");
