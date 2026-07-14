import mongoose, { Schema, Document, Model } from "mongoose";

export interface IParty extends Document {
  slug: string;
  name: string;
  nameHindi?: string;
  abbr?: string;
  tier: "National" | "State" | "RUPP";
  status: string;
  founded?: number;
  ideology?: string;
  president?: string;
  hq?: string;
  states: string[];
  state?: string;
  headquartersAddress?: string;
  pincode?: string;
  flag?: string;
  logo?: string;
  alliance?: string;
  seatsLokSabha?: number;
  seatsRajyaSabha?: number;
  website?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const S = new Schema<IParty>({
  slug:{type:String,required:true,unique:true,index:true}, name:{type:String,required:true},
  nameHindi:String, abbr:String,
  tier:{type:String,enum:["National","State","RUPP"],index:true},
  status:{type:String,default:"Active",index:true},
  founded:Number, ideology:String, president:String,
  hq:String, states:[String], state:String,
  headquartersAddress:String, pincode:String,
  flag:String,
  logo:String,
  alliance:String,
  seatsLokSabha:Number, seatsRajyaSabha:Number,
  website:String, description:String
},{timestamps:true});
S.index({name:"text",nameHindi:"text"});
export default (mongoose.models.Party || mongoose.model<IParty>("Party", S));
