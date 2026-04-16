import mongoose, { Schema, Model } from "mongoose";
const S = new Schema({
  email:{type:String,required:true,unique:true}, name:String,
  role:{type:String,enum:["admin","editor"],default:"admin"}, passwordHash:String
},{timestamps:true});
export default (mongoose.models.User||mongoose.model("User",S)) as Model<any>;
