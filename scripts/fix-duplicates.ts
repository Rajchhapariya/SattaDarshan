import connectDB from "../lib/db";
import Politician from "../models/Politician";
import Party from "../models/Party";

async function fixDupes() {
  await connectDB();

  console.log("--- MERGING BJP ---");
  const res = await Politician.updateMany(
    { party: "bharatiya-janata-party" },
    { $set: { party: "bjp", partyName: "BJP" } }
  );
  console.log(`Updated ${res.modifiedCount} politicians to use 'bjp' slug.`);

  const partyDel = await Party.deleteOne({ slug: "bharatiya-janata-party" });
  console.log(`Deleted 'bharatiya-janata-party': ${partyDel.deletedCount}`);

  console.log("--- DELETING MODI DUPLICATE ---");
  const pmDel = await Politician.deleteOne({ slug: "shri-narendra-modi" });
  console.log(`Deleted 'shri-narendra-modi': ${pmDel.deletedCount}`);
  
  process.exit(0);
}

fixDupes();
