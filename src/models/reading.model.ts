import mongoose, { Schema, Document } from "mongoose";

export interface IReading extends Document {
  title: string;
  content: string;
  type: string; // e.g. "story", "article", "poem"
  readingType: string; // e.g. "questReading"
  class: string;       // e.g. "Grade 5", "Class 7"
  subject: string;     // e.g. "English", "Science"
  createdAt?: Date;
  updatedAt?: Date;
}

const readingSchema = new Schema<IReading>(
  {
    class: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    readingType: { type: String, trim: true }, // e.g. "questReading"
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const ReadingModel = mongoose.model<IReading>("Reading", readingSchema);
