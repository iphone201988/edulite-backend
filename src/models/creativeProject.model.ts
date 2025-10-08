import { required } from "joi";
import mongoose, { Schema } from "mongoose";

const creativeProjectSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    type:{type:String,default:"creativeProject"},
    time: { type: Number },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userName:{type:String  }
})


const creativeProjectProjectModel=mongoose.model(
    "creativeProject",
    creativeProjectSchema,
    "creativeProject"

)



export default creativeProjectProjectModel;