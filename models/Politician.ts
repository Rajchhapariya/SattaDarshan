import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPolitician extends Document {
  slug: string;
  name: string;
  photo?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  role: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const S = new Schema<IPolitician>({
  slug:{type:String,required:true,unique:true,index:true},   name:{type:String,required:true},
  photo:String, dob:String, gender:{type:String,enum:["Male","Female","Other"]},
  role:{type:String,required:true,index:true}, status:{type:String,default:"Active",index:true},
  party:{type:String,required:true,index:true}, partyName:String,
  state:{type:String,required:true,index:true}, constituency:String,
  chamber:String, termStart:String, termEnd:String,
   education:String, assets:String, criminalCases:Number,
  bio:String,
  socialLinks:{twitter:String,facebook:String,instagram:String,website:String}, tags:[String]
},{timestamps:true});
S.index({name:"text",constituency:"text"});
export default (mongoose.models.Politician || mongoose.model<IPolitician>("Politician", S));
