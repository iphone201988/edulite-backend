import mongoose, { Schema, Document } from "mongoose";

interface ISubject {
  name: string;
  types: string[]; // e.g., ["Quiz", "Test", "Assignment"]
  string
}

interface IGrade extends Document {
  grade: string; // e.g., "Grade 1"
  subjects: ISubject[];
  icon:string
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  types: { type: [String], default: [] },
  icon: { type: String },
});

const GradeSchema: Schema = new Schema(
  {
    grade: { type: String, required: true, unique: true },
    icon: { type: String },
    subjects: { type: [SubjectSchema], default: [] },
  },
  { timestamps: true }
);

const GradeModel = mongoose.model<IGrade>("Grade", GradeSchema);

export default GradeModel;