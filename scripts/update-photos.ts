import "dotenv/config";
import connectDB from "../lib/db";
import Politician from "../models/Politician";

const photos: Record<string, string> = {
  "narendra-modi": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Narendra_Modi_17th_Lok_Sabha.jpg/440px-Narendra_Modi_17th_Lok_Sabha.jpg",
  "amit-shah": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amit_Shah_2019.jpg/440px-Amit_Shah_2019.jpg",
  "rahul-gandhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Rahul_Gandhi_2019.jpg/440px-Rahul_Gandhi_2019.jpg",
  "mamata-banerjee": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mamata_Banerjee_2014.jpg/440px-Mamata_Banerjee_2014.jpg",
  "arvind-kejriwal": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Arvind_Kejriwal_in_2023.jpg/440px-Arvind_Kejriwal_in_2023.jpg",
  "yogi-adityanath": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Yogi_Adityanath_2023.jpg/440px-Yogi_Adityanath_2023.jpg",
  "mk-stalin": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/MK_Stalin_2022.jpg/440px-MK_Stalin_2022.jpg",
  "nitish-kumar": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Nitish_Kumar_2023.jpg/440px-Nitish_Kumar_2023.jpg",
  "siddaramaiah": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Siddaramaiah_2023.jpg/440px-Siddaramaiah_2023.jpg",
  "bhagwant-mann": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bhagwant_Mann_2022.jpg/440px-Bhagwant_Mann_2022.jpg",
};

async function main() {
  await connectDB();
  for (const [slug, photo] of Object.entries(photos)) {
    await Politician.updateOne({ slug }, { $set: { photo } });
    console.log("✅ Photo updated:", slug);
  }
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });