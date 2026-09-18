const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const queries = ['Kapil Sibal', 'Sharad Pawar', 'Gulam Ali', 'Modi Varanasi', 'Rahul Raebareli', 'Samrat Choudhary', 'Yogi Adityanath', 'Shashi Tharoor', 'Devendra Fadnavis'];
  for (const q of queries) {
    const words = q.split(/\s+/).filter(Boolean);
    const filter = {
      $and: words.map(w => ({
        $or: [
          { name: { $regex: w, $options: 'i' } },
          { slug: { $regex: w, $options: 'i' } },
          { constituency: { $regex: w, $options: 'i' } },
          { partyName: { $regex: w, $options: 'i' } },
          { state: { $regex: w, $options: 'i' } },
        ]
      }))
    };
    const res = await db.collection('politicians').find(filter).limit(3).toArray();
    console.log(q, '=>', res.map(p => p.name));
  }
  await mongoose.disconnect();
}
test();
