import mongoose, { Schema, Model } from "mongoose";
const S = new Schema({
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
export default (mongoose.models.Politician||mongoose.model("Politician",S)) as Model<any>;
