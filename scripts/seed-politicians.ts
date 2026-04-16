import "dotenv/config";
import { connectDB } from "../lib/db";
import Politician from "../models/Politician";
const POLITICIANS = [
  { slug:"narendra-modi", name:"Narendra Modi", nameHindi:"नरेंद्र मोदी", role:"PM", status:"Active", party:"bjp", partyName:"BJP", state:"Gujarat", constituency:"Varanasi", chamber:"Lok Sabha", gender:"Male", dob:"1950-09-17", education:"MA Political Science", criminalCases:0, bio:"14th Prime Minister of India, serving since 2014. Former CM of Gujarat (2001–2014). Led BJP to historic majorities in 2014 and 2019 Lok Sabha elections.", socialLinks:{twitter:"https://twitter.com/narendramodi",website:"https://www.narendramodi.in"} },
  { slug:"amit-shah", name:"Amit Shah", nameHindi:"अमित शाह", role:"Minister", status:"Active", party:"bjp", partyName:"BJP", state:"Gujarat", constituency:"Gandhinagar", chamber:"Lok Sabha", gender:"Male", dob:"1964-10-22", criminalCases:0, bio:"Home Minister of India. Former BJP President who engineered the party's massive 2019 electoral victory." },
  { slug:"rahul-gandhi", name:"Rahul Gandhi", nameHindi:"राहुल गांधी", role:"MP", status:"Active", party:"inc", partyName:"INC", state:"Kerala", constituency:"Wayanad", chamber:"Lok Sabha", gender:"Male", dob:"1970-06-19", education:"MPhil, Cambridge", criminalCases:0, bio:"Leader of Opposition in Lok Sabha. Former Congress President. Led Bharat Jodo Yatra. Son of Rajiv Gandhi and Sonia Gandhi.", socialLinks:{twitter:"https://twitter.com/RahulGandhi"} },
  { slug:"mamata-banerjee", name:"Mamata Banerjee", nameHindi:"ममता बनर्जी", role:"CM", status:"Active", party:"tmc", partyName:"TMC", state:"west-bengal", constituency:"Bhowanipore", chamber:"State Assembly", gender:"Female", dob:"1955-01-05", criminalCases:0, bio:"Chief Minister of West Bengal since 2011. Founded the Trinamool Congress in 1998. Known as 'Didi'.", socialLinks:{twitter:"https://twitter.com/MamataOfficial"} },
  { slug:"arvind-kejriwal", name:"Arvind Kejriwal", nameHindi:"अरविंद केजरीवाल", role:"Other", status:"Active", party:"aap", partyName:"AAP", state:"Delhi", chamber:"N/A", gender:"Male", dob:"1968-08-16", education:"IIT Kharagpur", criminalCases:1, bio:"National Convener of Aam Aadmi Party. Former Chief Minister of Delhi (2015–2024). Led Anna Hazare's anti-corruption movement.", socialLinks:{twitter:"https://twitter.com/ArvindKejriwal"} },
  { slug:"yogi-adityanath", name:"Yogi Adityanath", nameHindi:"योगी आदित्यनाथ", role:"CM", status:"Active", party:"bjp", partyName:"BJP", state:"uttar-pradesh", constituency:"Gorakhpur Urban", chamber:"State Assembly", gender:"Male", dob:"1972-06-05", criminalCases:0, bio:"Chief Minister of Uttar Pradesh since 2017. Head priest of Gorakhnath Math temple. Known for Hindutva politics and development initiatives in UP." },
  { slug:"mk-stalin", name:"M.K. Stalin", nameHindi:"एम.के. स्टालिन", role:"CM", status:"Active", party:"dmk", partyName:"DMK", state:"tamil-nadu", constituency:"Kolathur", chamber:"State Assembly", gender:"Male", dob:"1953-03-01", criminalCases:0, bio:"Chief Minister of Tamil Nadu since 2021. President of DMK. Son of former CM M. Karunanidhi." },
  { slug:"nitish-kumar", name:"Nitish Kumar", nameHindi:"नीतीश कुमार", role:"CM", status:"Active", party:"jdu", partyName:"JDU", state:"bihar", chamber:"State Assembly", gender:"Male", dob:"1951-03-08", criminalCases:0, bio:"Chief Minister of Bihar, serving multiple terms since 2005. President of JDU. Known for Sushasan (good governance) in Bihar." },
  { slug:"siddaramaiah", name:"Siddaramaiah", nameHindi:"सिद्दारमैया", role:"CM", status:"Active", party:"inc", partyName:"INC", state:"karnataka", constituency:"Varuna", chamber:"State Assembly", gender:"Male", dob:"1948-08-03", criminalCases:0, bio:"Chief Minister of Karnataka since 2023. Former Deputy CM and Finance Minister of Karnataka. Senior Congress leader." },
  { slug:"bhagwant-mann", name:"Bhagwant Mann", nameHindi:"भगवंत मान", role:"CM", status:"Active", party:"aap", partyName:"AAP", state:"punjab", constituency:"Dhuri", chamber:"State Assembly", gender:"Male", dob:"1973-10-18", criminalCases:0, bio:"Chief Minister of Punjab since 2022. AAP's Punjab unit president. Former comedian and TV personality turned politician." },
];
async function main() {
  await connectDB();
  let added = 0, skipped = 0;
  for (const p of POLITICIANS) {
    const exists = await Politician.findOne({ slug: p.slug });
    if (exists) { skipped++; continue; }
    await Politician.create(p);
    added++;
    console.log("  +", p.name);
  }
  console.log(`✅ Politicians: ${added} added, ${skipped} skipped`);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
