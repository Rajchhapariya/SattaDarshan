import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPublicOffice {
  title: string;
  category: "executive" | "legislative" | "party" | "constitutional";
  rank?: string;
  jurisdiction?: string;
  portfolios?: string[];
  startDate?: string;
  endDate?: string;
  status: "serving" | "former";
  source?: string;
  sourceUrl?: string;
  verifiedAt?: Date;
}

export interface IPolitician extends Document {
  slug: string;
  name: string;
  photo?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  role: string;
  currentOffice?: string;
  ministerialRank?: string;
  portfolios?: string[];
  offices?: IPublicOffice[];
  status: string;
  party: string;
  partyName?: string;
  state: string;
  constituency?: string;
  chamber?: string;
  termStart?: string;
  termEnd?: string;
  education?: string;
  assets?: string;
  criminalCases: number;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  tags: string[];
  source?: string;
  sourceUrl?: string;
  sourceDate?: string;
  lastVerifiedAt?: Date;
  verificationStatus?: "official" | "verified" | "historical" | "unverified";
  verificationNotes?: string;
  tenureStatus?: "serving" | "former" | "historical";
  createdAt: Date;
  updatedAt: Date;
}

const S = new Schema<IPolitician>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  photo: String,
  dob: String,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  role: { type: String, required: true, index: true },
  currentOffice: String,
  ministerialRank: { type: String, index: true },
  portfolios: [String],
  offices: [{
    title: { type: String, required: true },
    category: { type: String, enum: ["executive", "legislative", "party", "constitutional"] },
    rank: String,
    jurisdiction: String,
    portfolios: [String],
    startDate: String,
    endDate: String,
    status: { type: String, enum: ["serving", "former"] },
    source: String,
    sourceUrl: String,
    verifiedAt: Date,
  }],
  status: { type: String, default: "Active", index: true },
  party: { type: String, required: true, index: true },
  partyName: String,
  state: { type: String, required: true, index: true },
  constituency: String,
  chamber: String,
  termStart: String,
  termEnd: String,
  education: String,
  assets: String,
  criminalCases: Number,
  bio: String,
  socialLinks: {
    twitter: String,
    facebook: String,
    instagram: String,
    website: String,
  },
  tags: [String],
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
  tenureStatus: {
    type: String,
    enum: ["serving", "former", "historical"],
    default: "serving",
    index: true,
  },
}, { timestamps: true });

S.index({ name: "text", constituency: "text" });
export default (mongoose.models.Politician || mongoose.model<IPolitician>("Politician", S));
