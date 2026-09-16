const mongoose = require('mongoose');
const crypto = require('crypto');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
});

const before = JSON.parse(fs.readFileSync('scratch/db_integrity_before.json', 'utf8'));

async function verify() {
  await mongoose.connect(env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collections = ['politicians', 'parties', 'states'];
  let allMatch = true;

  for (const collName of collections) {
    const docs = await db.collection(collName).find({}, { projection: { _id: 1, slug: 1, updatedAt: 1, name: 1 } }).sort({ _id: 1 }).toArray();
    const hash = crypto.createHash('sha256').update(JSON.stringify(docs)).digest('hex');
    const match = hash === before[collName].hash && docs.length === before[collName].count;
    console.log(`Collection ${collName}: ${docs.length} records. Hash match: ${match} (${hash})`);
    if (!match) allMatch = false;
  }

  if (allMatch) {
    console.log('\n>>> DATABASE INTEGRITY VERIFIED: ZERO UNINTENDED MUTATIONS! <<<');
  } else {
    console.error('\n>>> ERROR: DATABASE RECORD MISMATCH DETECTED! <<<');
    process.exit(1);
  }
  await mongoose.disconnect();
}
verify();
