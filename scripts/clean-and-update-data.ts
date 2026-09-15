import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import connectDB from "../lib/db";
import Politician from "../models/Politician";
import Party from "../models/Party";
import State from "../models/State";

const CMS = [
  { state: "Andhra Pradesh", name: "N. Chandrababu Naidu", partyName: "TDP", partySlug: "tdp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/N._Chandrababu_Naidu_in_2024.jpg/440px-N._Chandrababu_Naidu_in_2024.jpg" },
  { state: "Arunachal Pradesh", name: "Pema Khandu", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Pema_Khandu_2024.jpg/440px-Pema_Khandu_2024.jpg" },
  { state: "Assam", name: "Himanta Biswa Sarma", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Himanta_Biswa_Sarma_2023.jpg/440px-Himanta_Biswa_Sarma_2023.jpg" },
  { state: "Bihar", name: "Nitish Kumar", partyName: "JDU", partySlug: "jdu", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Nitish_Kumar_2023.jpg/440px-Nitish_Kumar_2023.jpg" },
  { state: "Chhattisgarh", name: "Vishnu Deo Sai", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Vishnu_Deo_Sai_2023.jpg/440px-Vishnu_Deo_Sai_2023.jpg" },
  { state: "Delhi", name: "Atishi", partyName: "AAP", partySlug: "aap", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Atishi_Marlena_2024.jpg/440px-Atishi_Marlena_2024.jpg" },
  { state: "Goa", name: "Pramod Sawant", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Pramod_Sawant_2022.jpg/440px-Pramod_Sawant_2022.jpg" },
  { state: "Gujarat", name: "Bhupendrabhai Patel", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Bhupendra_Patel_2022.jpg/440px-Bhupendra_Patel_2022.jpg" },
  { state: "Haryana", name: "Nayab Singh Saini", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Nayab_Singh_Saini_2024.jpg/440px-Nayab_Singh_Saini_2024.jpg" },
  { state: "Himachal Pradesh", name: "Sukhvinder Singh Sukhu", partyName: "INC", partySlug: "inc", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Sukhvinder_Singh_Sukhu_2022.jpg/440px-Sukhvinder_Singh_Sukhu_2022.jpg" },
  { state: "Jammu and Kashmir", name: "Omar Abdullah", partyName: "JKNC", partySlug: "jammu-kashmir-national-conference", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Omar_Abdullah_2024.jpg/440px-Omar_Abdullah_2024.jpg" },
  { state: "Jharkhand", name: "Hemant Soren", partyName: "JMM", partySlug: "jharkhand-mukti-morcha", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Hemant_Soren_2024.jpg/440px-Hemant_Soren_2024.jpg" },
  { state: "Karnataka", name: "Siddaramaiah", partyName: "INC", partySlug: "inc", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Siddaramaiah_2023.jpg/440px-Siddaramaiah_2023.jpg" },
  { state: "Kerala", name: "Pinarayi Vijayan", partyName: "CPI(M)", partySlug: "cpi-m", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Pinarayi_Vijayan_2021.jpg/440px-Pinarayi_Vijayan_2021.jpg" },
  { state: "Madhya Pradesh", name: "Mohan Yadav", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Mohan_Yadav_2023.jpg/440px-Mohan_Yadav_2023.jpg" },
  { state: "Maharashtra", name: "Devendra Fadnavis", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Devendra_Fadnavis_2024.jpg/440px-Devendra_Fadnavis_2024.jpg" },
  { state: "Manipur", name: "N. Biren Singh", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/N_Biren_Singh_2022.jpg/440px-N_Biren_Singh_2022.jpg" },
  { state: "Meghalaya", name: "Conrad Sangma", partyName: "NPP", partySlug: "national-people-s-party-india", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Conrad_Sangma_2023.jpg/440px-Conrad_Sangma_2023.jpg" },
  { state: "Mizoram", name: "Lalduhoma", partyName: "ZPM", partySlug: "zoram-people-s-movement", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Lalduhoma_2023.jpg/440px-Lalduhoma_2023.jpg" },
  { state: "Nagaland", name: "Neiphiu Rio", partyName: "NDPP", partySlug: "ndpp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Neiphiu_Rio_2023.jpg/440px-Neiphiu_Rio_2023.jpg" },
  { state: "Odisha", name: "Mohan Charan Majhi", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mohan_Charan_Majhi_2024.jpg/440px-Mohan_Charan_Majhi_2024.jpg" },
  { state: "Puducherry", name: "N. Rangasamy", partyName: "AINRC", partySlug: "all-india-n-r-congress", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/N_Rangasamy_2021.jpg/440px-N_Rangasamy_2021.jpg" },
  { state: "Punjab", name: "Bhagwant Mann", partyName: "AAP", partySlug: "aap", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bhagwant_Mann_2022.jpg/440px-Bhagwant_Mann_2022.jpg" },
  { state: "Rajasthan", name: "Bhajan Lal Sharma", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Bhajan_Lal_Sharma_2023.jpg/440px-Bhajan_Lal_Sharma_2023.jpg" },
  { state: "Sikkim", name: "Prem Singh Tamang", partyName: "SKM", partySlug: "sikkim-krantikari-morcha", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Prem_Singh_Tamang_2024.jpg/440px-Prem_Singh_Tamang_2024.jpg" },
  { state: "Tamil Nadu", name: "M. K. Stalin", partyName: "DMK", partySlug: "dmk", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/MK_Stalin_2022.jpg/440px-MK_Stalin_2022.jpg" },
  { state: "Telangana", name: "Revanth Reddy", partyName: "INC", partySlug: "inc", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Revanth_Reddy_2023.jpg/440px-Revanth_Reddy_2023.jpg" },
  { state: "Tripura", name: "Manik Saha", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Manik_Saha_2023.jpg/440px-Manik_Saha_2023.jpg" },
  { state: "Uttar Pradesh", name: "Yogi Adityanath", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Yogi_Adityanath_2023.jpg/440px-Yogi_Adityanath_2023.jpg" },
  { state: "Uttarakhand", name: "Pushkar Singh Dhami", partyName: "BJP", partySlug: "bjp", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Pushkar_Singh_Dhami_2022.jpg/440px-Pushkar_Singh_Dhami_2022.jpg" },
  { state: "West Bengal", name: "Mamata Banerjee", partyName: "TMC", partySlug: "tmc", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mamata_Banerjee_2014.jpg/440px-Mamata_Banerjee_2014.jpg" }
];

const NATIONAL_LEADERS = [
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
    bio: "Prime Minister of India since 2014 and Member of Parliament representing Varanasi, Uttar Pradesh.",
    education: "Post Graduate (MA Political Science)",
    assets: "₹3.02 Crore",
    criminalCases: 0
  },
  {
    slug: "rahul-gandhi",
    name: "Rahul Gandhi",
    role: "Leader of Opposition",
    chamber: "Lok Sabha",
    party: "inc",
    partyName: "INC",
    state: "Uttar Pradesh",
    constituency: "Rae Bareli",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Rahul_Gandhi_2019.jpg/440px-Rahul_Gandhi_2019.jpg",
    bio: "Leader of the Opposition in the 18th Lok Sabha and Member of Parliament representing Rae Bareli, Uttar Pradesh.",
    education: "M.Phil (Trinity College, Cambridge)",
    assets: "₹20.4 Crore",
    criminalCases: 0
  },
  {
    slug: "amit-shah",
    name: "Amit Shah",
    role: "Minister",
    chamber: "Lok Sabha",
    party: "bjp",
    partyName: "BJP",
    state: "Gujarat",
    constituency: "Gandhinagar",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amit_Shah_2019.jpg/440px-Amit_Shah_2019.jpg",
    bio: "Union Minister of Home Affairs and Cooperation, Government of India. MP from Gandhinagar.",
    education: "B.Sc (Biochemistry)",
    assets: "₹36.0 Crore",
    criminalCases: 0
  },
  {
    slug: "rajnath-singh",
    name: "Rajnath Singh",
    role: "Minister",
    chamber: "Lok Sabha",
    party: "bjp",
    partyName: "BJP",
    state: "Uttar Pradesh",
    constituency: "Lucknow",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Rajnath_Singh_2023.jpg/440px-Rajnath_Singh_2023.jpg",
    bio: "Union Minister of Defence, Government of India. MP from Lucknow.",
    education: "M.Sc (Physics)",
    assets: "₹6.1 Crore",
    criminalCases: 0
  },
  {
    slug: "s-jaishankar",
    name: "S. Jaishankar",
    role: "Minister",
    chamber: "Rajya Sabha",
    party: "bjp",
    partyName: "BJP",
    state: "Gujarat",
    constituency: "Rajya Sabha",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Dr._S._Jaishankar_2023.jpg/440px-Dr._S._Jaishankar_2023.jpg",
    bio: "Union Minister of External Affairs, Government of India. Member of Parliament in Rajya Sabha.",
    education: "Ph.D (International Relations, JNU)",
    assets: "₹15.8 Crore",
    criminalCases: 0
  },
  {
    slug: "nirmala-sitharaman",
    name: "Nirmala Sitharaman",
    role: "Minister",
    chamber: "Rajya Sabha",
    party: "bjp",
    partyName: "BJP",
    state: "Karnataka",
    constituency: "Rajya Sabha",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Nirmala_Sitharaman_2023.jpg/440px-Nirmala_Sitharaman_2023.jpg",
    bio: "Union Minister of Finance and Corporate Affairs, Government of India. Member of Rajya Sabha.",
    education: "M.Phil (Economics, JNU)",
    assets: "₹2.5 Crore",
    criminalCases: 0
  },
  {
    slug: "nitin-gadkari",
    name: "Nitin Gadkari",
    role: "Minister",
    chamber: "Lok Sabha",
    party: "bjp",
    partyName: "BJP",
    state: "Maharashtra",
    constituency: "Nagpur",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Nitin_Gadkari_2023.jpg/440px-Nitin_Gadkari_2023.jpg",
    bio: "Union Minister for Road Transport and Highways. MP representing Nagpur, Maharashtra.",
    education: "M.Com, LL.B",
    assets: "₹28.0 Crore",
    criminalCases: 0
  },
  {
    slug: "mallikarjun-kharge",
    name: "Mallikarjun Kharge",
    role: "Leader of Opposition (RS)",
    chamber: "Rajya Sabha",
    party: "inc",
    partyName: "INC",
    state: "Karnataka",
    constituency: "Rajya Sabha",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mallikarjun_Kharge_2024.jpg/440px-Mallikarjun_Kharge_2024.jpg",
    bio: "President of Indian National Congress and Leader of Opposition in the Rajya Sabha.",
    education: "B.A., LL.B",
    assets: "₹15.7 Crore",
    criminalCases: 0
  },
  {
    slug: "akhilesh-yadav",
    name: "Akhilesh Yadav",
    role: "MP",
    chamber: "Lok Sabha",
    party: "sp",
    partyName: "SP",
    state: "Uttar Pradesh",
    constituency: "Kannauj",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Akhilesh_Yadav_2023.jpg/440px-Akhilesh_Yadav_2023.jpg",
    bio: "National President of Samajwadi Party, former Chief Minister of UP, MP from Kannauj.",
    education: "Master's in Environmental Engineering (University of Sydney)",
    assets: "₹42.0 Crore",
    criminalCases: 0
  }
];

const ALLIANCE_MAPPINGS: Record<string, "NDA" | "INDIA" | "Others"> = {
  // NDA
  "bjp": "NDA",
  "bharatiya-janata-party": "NDA",
  "tdp": "NDA",
  "telugu-desam-party": "NDA",
  "jdu": "NDA",
  "janata-dal-united": "NDA",
  "shiv-sena": "NDA",
  "lok-janshakti-party-ram-vilas": "NDA",
  "janasena-party": "NDA",
  "janata-dal-secular": "NDA",
  "apna-dal-soneylal": "NDA",
  "asom-gana-parishad": "NDA",
  "united-people-s-party-liberal": "NDA",
  "sikkim-krantikari-morcha": "NDA",
  "all-jharkhand-students-union": "NDA",
  "hindustani-awam-morcha": "NDA",
  "rashtriya-lok-morcha": "NDA",

  // INDIA
  "inc": "INDIA",
  "indian-national-congress": "INDIA",
  "sp": "INDIA",
  "samajwadi-party": "INDIA",
  "tmc": "INDIA",
  "all-india-trinamool-congress": "INDIA",
  "dmk": "INDIA",
  "dravida-munnetra-kazhagam": "INDIA",
  "shiv-sena-ubt": "INDIA",
  "nationalist-congress-party-sharadchandra-pawar": "INDIA",
  "cpi-m": "INDIA",
  "communist-party-of-india-marxist": "INDIA",
  "rjd": "INDIA",
  "rashtriya-janata-dal": "INDIA",
  "aap": "INDIA",
  "aam-aadmi-party": "INDIA",
  "jharkhand-mukti-morcha": "INDIA",
  "cpi": "INDIA",
  "communist-party-of-india": "INDIA",
  "indian-union-muslim-league": "INDIA",
  "communist-party-of-india-marxist-leninist-liberation": "INDIA",
  "jammu-kashmir-national-conference": "INDIA",
  "viduthalai-chiruthaigal-katchi": "INDIA",
  "marumalarchi-dravida-munnetra-kazhagam": "INDIA",
  "bharat-aadivasi-party": "INDIA",
  "rashtriya-loktantrik-party": "INDIA",

  // Regional / Others
  "ysr-congress-party": "Others",
  "ysrcp": "Others",
  "biju-janata-dal": "Others",
  "bjd": "Others",
  "bharat-rashtra-samithi": "Others",
  "bahujan-samaj-party": "Others",
  "bsp": "Others",
  "shiromani-akali-dal": "Others",
  "all-india-majlis-e-ittehadul-muslimeen": "Others",
  "zoram-people-s-movement": "Others",
  "voice-of-the-people-party-meghalaya": "Others",
  "all-india-united-democratic-front": "Others",
  "independent": "Others"
};

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  await connectDB();
  console.log("🚀 Starting Comprehensive Data Cleanup & Update...");

  // 1. Purge scraper garbage
  const deleted = await Politician.deleteMany({
    $or: [
      { name: /^file:/i },
      { slug: /^file-/i },
      { name: /svg$/i },
      { slug: "list" },
      { state: /membership by/i }
    ]
  });
  console.log(`🧹 Cleaned up ${deleted.deletedCount} scraper garbage documents.`);

  // 2. Fix bracketed wiki states and party names
  const allPoliticians = await Politician.find().lean();
  let cleanedSyntax = 0;
  for (const p of allPoliticians) {
    let update: Record<string, any> = {};
    if (p.state && p.state.includes("[[")) {
      const match = p.state.match(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/);
      if (match && match[1]) {
        update.state = match[1].trim();
      }
    }
    if (p.name && p.name.includes("[[")) {
      const match = p.name.match(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/);
      if (match && match[1]) {
        update.name = match[1].trim();
      }
    }
    if (Object.keys(update).length > 0) {
      await Politician.updateOne({ _id: p._id }, { $set: update });
      cleanedSyntax++;
    }
  }
  console.log(`✨ Cleaned bracketed wiki syntax on ${cleanedSyntax} politicians.`);

  // 3. Upsert National Leaders
  for (const leader of NATIONAL_LEADERS) {
    await Politician.updateOne(
      { slug: leader.slug },
      { $set: leader },
      { upsert: true }
    );
    console.log(`⭐ Synced leader: ${leader.name} (${leader.role})`);
  }

  // 4. Upsert / Synchronize All Chief Ministers
  for (const cm of CMS) {
    const slug = toSlug(cm.name);
    await Politician.updateOne(
      { slug },
      {
        $set: {
          name: cm.name,
          slug,
          role: "CM",
          party: cm.partySlug,
          partyName: cm.partyName,
          state: cm.state,
          chamber: "State Assembly",
          status: "Active",
          photo: cm.photo,
          bio: `Chief Minister of ${cm.state}, representing the ${cm.partyName}.`
        }
      },
      { upsert: true }
    );

    // Also update State collection with ruling party and CM
    await State.updateOne(
      { slug: toSlug(cm.state) },
      {
        $set: {
          cm: cm.name,
          cmSlug: slug,
          rulingParty: cm.partyName,
          rulingPartySlug: cm.partySlug
        }
      }
    );
  }
  console.log(`🏛️ Synced all ${CMS.length} Chief Ministers & State associations.`);

  // 5. Update Party Alliances and Logos
  const parties = await Party.find();
  let partyUpdated = 0;
  for (const p of parties) {
    let alliance = ALLIANCE_MAPPINGS[p.slug] || p.alliance || "Others";
    let logo = `/flags/${p.slug}.png`;
    // Alias checks
    if (p.slug === "bjp") logo = "/flags/bjp.png";
    if (p.slug === "inc") logo = "/flags/inc.png";
    if (p.slug === "aap") logo = "/flags/aap.png";
    if (p.slug === "dmk") logo = "/flags/dmk.png";
    if (p.slug === "sp") logo = "/flags/sp.png";
    if (p.slug === "tmc") logo = "/flags/tmc.png";
    if (p.slug === "jdu") logo = "/flags/jdu.png";
    if (p.slug === "tdp") logo = "/flags/tdp.png";

    await Party.updateOne(
      { _id: p._id },
      { $set: { alliance, logo } }
    );
    partyUpdated++;
  }
  console.log(`🚩 Updated alliances and logos for ${partyUpdated} parties.`);

  console.log("✅ Data synchronization complete!");
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
