import mongoose, { Schema, Model } from "mongoose";
const S = new Schema({
  slug:{type:String,required:true,unique:true}, name:{type:String,required:true},
  capital:String, region:String,
  rulingParty:String, rulingPartySlug:String, cm:String, cmSlug:String,
  totalAssemblySeats:Number, totalLokSabhaSeats:Number
},{timestamps:true});
export default (mongoose.models.State||mongoose.model("State",S)) as Model<any>;
