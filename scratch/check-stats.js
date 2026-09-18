const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const total = await db.collection('politicians').countDocuments();
  const withCriminal = await db.collection('politicians').countDocuments({ criminalCases: { $exists: true, $ne: null } });
  const withAssets = await db.collection('politicians').countDocuments({ assets: { $exists: true, $ne: null } });
  const withEducation = await db.collection('politicians').countDocuments({ education: { $exists: true, $ne: null } });

  console.log({ total, withCriminal, withAssets, withEducation });
  await mongoose.disconnect();
}
check();
