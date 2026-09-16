// scratch/update-bihar-cm.js
// Update Bihar Chief Minister data to Samrat Choudhary following user approval

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function execute() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const now = new Date();

  // 1. Update State record for Bihar
  console.log("1. Updating Bihar state record...");
  const stateRes = await db.collection('states').updateOne(
    { slug: 'bihar' },
    {
      $set: {
        cm: 'Samrat Choudhary',
        cmSlug: 'samrat-choudhary',
        rulingParty: 'BJP',
        rulingPartySlug: 'bjp',
        lastVerifiedAt: now,
        updatedAt: now,
      }
    }
  );
  console.log("State updated:", stateRes.modifiedCount);

  // 2. Update Nitish Kumar record to former CM / Rajya Sabha MP
  console.log("2. Updating Nitish Kumar record...");
  const nitishRes = await db.collection('politicians').updateOne(
    { slug: 'nitish-kumar' },
    {
      $set: {
        role: 'MP',
        chamber: 'Rajya Sabha',
        currentOffice: 'Member of Parliament, Rajya Sabha / Former Chief Minister of Bihar',
        tenureStatus: 'former',
        'offices.0.status': 'former',
        'offices.0.endDate': '2026-04-14',
        lastVerifiedAt: now,
        updatedAt: now,
      }
    }
  );
  console.log("Nitish Kumar updated:", nitishRes.modifiedCount);

  // 3. Upsert Samrat Choudhary as serving Chief Minister of Bihar
  console.log("3. Upserting Samrat Choudhary record...");
  const samratRes = await db.collection('politicians').updateOne(
    { slug: 'samrat-choudhary' },
    {
      $set: {
        name: 'Samrat Choudhary',
        slug: 'samrat-choudhary',
        role: 'CM',
        currentOffice: 'Chief Minister of Bihar',
        ministerialRank: 'Chief Minister',
        portfolios: ['Home', 'General Administration', 'Cabinet Secretariat'],
        party: 'bjp',
        partyName: 'BJP',
        state: 'Bihar',
        chamber: 'Vidhan Parishad',
        constituency: 'Bihar Legislative Council',
        gender: 'Male',
        status: 'Active',
        tenureStatus: 'serving',
        verificationStatus: 'official',
        photo: '/politicians/samrat-choudhary.webp',
        bio: 'Chief Minister of Bihar, representing the Bharatiya Janata Party (BJP). Sworn in on April 15, 2026.',
        tags: ['Chief Minister', 'Bihar', 'BJP', 'NDA'],
        source: 'Government of Bihar & Official Gazettes',
        sourceUrl: 'https://cm.bihar.gov.in',
        sourceDate: '2026-04-15',
        lastVerifiedAt: now,
        updatedAt: now,
        offices: [
          {
            title: 'Chief Minister of Bihar',
            category: 'executive',
            rank: 'Chief Minister',
            jurisdiction: 'Government of Bihar',
            startDate: '2026-04-15',
            status: 'serving',
            source: 'Government of Bihar & Official Gazettes',
            verifiedAt: now
          }
        ]
      },
      $setOnInsert: {
        createdAt: now,
        criminalCases: 0
      }
    },
    { upsert: true }
  );
  console.log("Samrat Choudhary upserted:", samratRes.upsertedCount || samratRes.modifiedCount);

  console.log("\n>>> BIHAR CM UPDATE COMPLETED SUCCESSFULLY! <<<");
  await mongoose.disconnect();
}

execute().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
