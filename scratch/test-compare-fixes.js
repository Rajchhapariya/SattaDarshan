const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Test getSearchTokens logic identical to Combobox.tsx
function getSearchTokens(item) {
  let text = item.label;

  if (item.label.includes(",")) {
    const parts = item.label.split(",").map((p) => p.trim());
    if (parts.length === 2) {
      const lastName = parts[0];
      const firstNameWithHonorific = parts[1];
      const cleanFirst = firstNameWithHonorific.replace(/^(shri|smt\.?|dr\.?|prof\.?|adv\.?)\s+/i, "");
      text += ` ${firstNameWithHonorific} ${lastName} ${cleanFirst} ${lastName}`;
    }
  }

  if (item.sub) text += ` ${item.sub}`;
  if (item.badge) text += ` ${item.badge}`;
  if (item.value) text += ` ${item.value.replace(/-/g, " ")}`;
  if (item.keywords && item.keywords.length > 0) text += ` ${item.keywords.join(" ")}`;

  return text.toLowerCase().replace(/[,.:()]/g, " ");
}

function filterCombobox(items, query) {
  const queryTokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter(item => {
    const text = getSearchTokens(item);
    return queryTokens.every(t => text.includes(t));
  });
}

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const docs = await db.collection('politicians').find({}).toArray();
  console.log(`Loaded ${docs.length} politicians from DB`);

  const comboboxItems = docs.map(p => {
    const officeOrRole = p.currentOffice || p.ministerialRank || p.role || "Representative";
    const location = p.constituency ? `${p.constituency}, ${p.state}` : (p.state || "India");
    return {
      value: p.slug,
      label: p.name,
      sub: `${officeOrRole} • ${p.partyName || "Independent"} (${location})`,
      badge: p.partyName,
      keywords: [
        p.constituency || "",
        p.state || "",
        p.role || "",
        p.currentOffice || "",
        p.chamber || "",
        ...(p.portfolios || []),
      ].filter(Boolean),
    };
  });

  const testQueries = [
    { q: "Kapil Sibal", expectedSlug: "sibal-shri-kapil" },
    { q: "Sharad Pawar", expectedSlug: "pawar-shri-sharadchandra" },
    { q: "Gulam Ali", expectedSlug: "ali-shri-gulam" },
    { q: "Modi Varanasi", expectedSlug: "narendra-modi" },
    { q: "Rahul Gandhi", expectedSlug: "rahul-gandhi" },
    { q: "Yogi Adityanath", expectedSlug: "yogi-adityanath" },
    { q: "Samrat Choudhary", expectedSlug: "samrat-choudhary" },
    { q: "Shashi Tharoor", expectedSlug: "dr-shashi-tharoor" },
    { q: "P Chidambaram", expectedSlug: "chidambaram-shri-p" },
    { q: "Devendra Fadnavis", expectedSlug: "devendra-fadnavis" },
    { q: "Dimple Yadav", expectedSlug: "smt-dimple-yadav" },
    { q: "Ram Gopal Yadav", expectedSlug: "yadav-prof-ram-gopal" }
  ];

  let passed = 0;
  for (const { q, expectedSlug } of testQueries) {
    const matches = filterCombobox(comboboxItems, q);
    const found = matches.some(m => m.value === expectedSlug);
    if (found) {
      console.log(`[PASS] "${q}" => found ${expectedSlug} (${matches[0].label})`);
      passed++;
    } else {
      console.error(`[FAIL] "${q}" => did NOT find ${expectedSlug}. Matches:`, matches.map(m => m.label));
    }
  }

  console.log(`\nResults: ${passed} / ${testQueries.length} search tests passed.`);
  await mongoose.disconnect();
}

verify().catch(console.error);
