import mongoose from "mongoose";
import Politician from "../models/Politician";
import "../lib/db";
import connectDB from "../lib/db";

async function run() {
  await connectDB();
  const ps = await Politician.find({ chamber: "Rajya Sabha" }).limit(5).lean();
  ps.forEach(p => {
    console.log(`Name: ${p.name}`);
    console.log(`Photo Size: ${p.photo?.length || 0}`);
    console.log(`Photo Start: ${p.photo?.substring(0, 50)}`);
    console.log('---');
  });
  process.exit();
}

run();
