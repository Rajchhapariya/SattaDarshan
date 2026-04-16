const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('No MONGODB_URI'); return; }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('politicians');
    const ps = await collection.find({ chamber: "Rajya Sabha" }).limit(5).toArray();
    ps.forEach(p => {
      console.log(`Name: ${p.name}`);
      console.log(`Photo Size: ${p.photo ? p.photo.length : 0}`);
      console.log(`Photo Clip: ${p.photo ? p.photo.substring(0, 50) : 'N/A'}`);
      console.log('---');
    });
  } finally {
    await client.close();
  }
}

run().catch(console.error);
