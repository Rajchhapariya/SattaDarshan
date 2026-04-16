import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import connectDB from "../lib/db";
import Politician from "../models/Politician";

type LeaderSeed = {
  slug: string;
  name: string;
  role: string;
  chamber: string;
  party: string;
  partyName: string;
  state: string;
  constituency?: string;
  photo?: string;
  bio?: string;
  status?: string;
};

const LEADERS: LeaderSeed[] = [
  {
    slug: "narendra-modi",
    name: "Narendra Modi",
    role: "PM",
    chamber: "Lok Sabha",
    party: "bjp",
    partyName: "BJP",
    state: "Uttar Pradesh",
    constituency: "Varanasi",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Narendra_Modi_17th_Lok_Sabha.jpg/440px-Narendra_Modi_17th_Lok_Sabha.jpg",
    bio: "Prime Minister of India since 2014 and MP from Varanasi.",
  },
  {
    slug: "jp-nadda",
    name: "J. P. Nadda",
    role: "Party President",
    chamber: "Rajya Sabha",
    party: "bjp",
    partyName: "BJP",
    state: "Himachal Pradesh",
    constituency: "Rajya Sabha",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/J.P._Nadda.jpg/440px-J.P._Nadda.jpg",
    bio: "National President of Bharatiya Janata Party.",
  },
  {
    slug: "mallikarjun-kharge",
    name: "Mallikarjun Kharge",
    role: "Party President",
    chamber: "Rajya Sabha",
    party: "inc",
    partyName: "INC",
    state: "Karnataka",
    constituency: "Rajya Sabha",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mallikarjun_Kharge_2024.jpg/440px-Mallikarjun_Kharge_2024.jpg",
    bio: "President of Indian National Congress.",
  },
  {
    slug: "akhilesh-yadav",
    name: "Akhilesh Yadav",
    role: "Party President",
    chamber: "Lok Sabha",
    party: "sp",
    partyName: "Samajwadi Party",
    state: "Uttar Pradesh",
    constituency: "Kannauj",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Akhilesh_Yadav_-_2024.jpg/440px-Akhilesh_Yadav_-_2024.jpg",
    bio: "National President of Samajwadi Party.",
  },
  {
    slug: "mayawati",
    name: "Mayawati",
    role: "Party President",
    chamber: "N/A",
    party: "bsp",
    partyName: "Bahujan Samaj Party",
    state: "Uttar Pradesh",
    constituency: "N/A",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Mayawati_2007.jpg/440px-Mayawati_2007.jpg",
    bio: "National President of Bahujan Samaj Party.",
  },
  {
    slug: "arvind-kejriwal",
    name: "Arvind Kejriwal",
    role: "Party President",
    chamber: "N/A",
    party: "aap",
    partyName: "AAP",
    state: "Delhi",
    constituency: "N/A",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Arvind_Kejriwal_in_2023.jpg/440px-Arvind_Kejriwal_in_2023.jpg",
    bio: "National Convener of Aam Aadmi Party.",
  },
  {
    slug: "mamata-banerjee",
    name: "Mamata Banerjee",
    role: "CM",
    chamber: "State Assembly",
    party: "tmc",
    partyName: "TMC",
    state: "West Bengal",
    constituency: "Bhowanipore",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mamata_Banerjee_2014.jpg/440px-Mamata_Banerjee_2014.jpg",
    bio: "Chief Minister of West Bengal and Chairperson of Trinamool Congress.",
  },
  {
    slug: "yogi-adityanath",
    name: "Yogi Adityanath",
    role: "CM",
    chamber: "State Assembly",
    party: "bjp",
    partyName: "BJP",
    state: "Uttar Pradesh",
    constituency: "Gorakhpur Urban",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Yogi_Adityanath_2023.jpg/440px-Yogi_Adityanath_2023.jpg",
    bio: "Chief Minister of Uttar Pradesh.",
  },
  {
    slug: "mk-stalin",
    name: "M. K. Stalin",
    role: "CM",
    chamber: "State Assembly",
    party: "dmk",
    partyName: "DMK",
    state: "Tamil Nadu",
    constituency: "Kolathur",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/MK_Stalin_2022.jpg/440px-MK_Stalin_2022.jpg",
    bio: "Chief Minister of Tamil Nadu and President of DMK.",
  },
  {
    slug: "nitish-kumar",
    name: "Nitish Kumar",
    role: "CM",
    chamber: "State Assembly",
    party: "jdu",
    partyName: "JDU",
    state: "Bihar",
    constituency: "N/A",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Nitish_Kumar_2023.jpg/440px-Nitish_Kumar_2023.jpg",
    bio: "Chief Minister of Bihar.",
  },
];

async function main() {
  await connectDB();
  let upserted = 0;
  for (const leader of LEADERS) {
    await Politician.updateOne(
      { slug: leader.slug },
      {
        $set: {
          ...leader,
          status: leader.status ?? "Active",
          gender: "Other",
        },
      },
      { upsert: true }
    );
    upserted++;
    console.log("✅ Upserted:", leader.name);
  }
  console.log(`\n🎯 Leadership seed complete: ${upserted} upserted`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
