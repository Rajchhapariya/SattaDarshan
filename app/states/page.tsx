import connectDB from "@/lib/db";
import State from "@/models/State";
import { getStatePath } from "@/lib/server/statePaths";
import { StatesClient } from "./StatesClient";

export const metadata = { title: "States & Union Territories — India" };

async function getStates() {
  try {
    await connectDB();
    const rawStates = await State.find({}).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(rawStates.map((s: any) => ({
      ...s,
      statePath: s.name ? getStatePath(s.name) : undefined,
    }))));
  } catch { return []; }
}

export default async function StatesPage() {
  const states = await getStates();
  
  return <StatesClient initialStates={states} />;
}

