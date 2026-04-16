import mongoose, { Schema, Model } from "mongoose";
const S = new Schema({
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
export default (mongoose.models.Party||mongoose.model("Party",S)) as Model<any>;
