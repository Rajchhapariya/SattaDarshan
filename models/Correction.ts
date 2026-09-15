import mongoose, { Schema, Document } from "mongoose";

export interface ICorrection extends Document {
  recordType: "politician" | "party" | "state" | "general";
  recordIdentifier: string;
  issueType: "outdated_info" | "factual_error" | "broken_link_image" | "party_affiliation" | "other";
  description: string;
  suggestedCorrection: string;
  sourceUrl?: string;
  contactEmail?: string;
  status: "pending" | "reviewed" | "resolved" | "rejected";
  ipHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const CorrectionSchema = new Schema<ICorrection>(
  {
    recordType: {
      type: String,
      enum: ["politician", "party", "state", "general"],
      required: true,
      index: true,
    },
    recordIdentifier: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      index: true,
    },
    issueType: {
      type: String,
      enum: ["outdated_info", "factual_error", "broken_link_image", "party_affiliation", "other"],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    suggestedCorrection: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    sourceUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    contactEmail: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "rejected"],
      default: "pending",
      index: true,
    },
    ipHash: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Correction || mongoose.model<ICorrection>("Correction", CorrectionSchema);
