import mongoose, { Schema, Document, Model } from "mongoose";

export interface IState extends Document {
  slug: string;
  name: string;
  capital?: string;
  region?: string;
  rulingParty?: string;
  rulingPartySlug?: string;
  cm?: string;
  cmSlug?: string;
  totalAssemblySeats?: number;
  totalLokSabhaSeats?: number;
  source?: string;
  sourceUrl?: string;
  sourceDate?: string;
  lastVerifiedAt?: Date;
  verificationStatus?: "official" | "verified" | "historical" | "unverified";
  verificationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const S = new Schema<IState>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  capital: String,
  region: String,
  rulingParty: String,
  rulingPartySlug: String,
  cm: String,
  cmSlug: String,
  totalAssemblySeats: Number,
  totalLokSabhaSeats: Number,
  source: String,
  sourceUrl: String,
  sourceDate: String,
  lastVerifiedAt: Date,
  verificationStatus: {
    type: String,
    enum: ["official", "verified", "historical", "unverified"],
    default: "unverified",
    index: true,
  },
  verificationNotes: String,
}, { timestamps: true });

export default (mongoose.models.State || mongoose.model<IState>("State", S));
