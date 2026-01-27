import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReadingProgress extends Document {
    userId: Types.ObjectId;
    readingId: Types.ObjectId;
    progress: number;        // 0 - 100
    lastPosition?: number;   // e.g. character index, paragraph index, etc.
    completed: boolean;
    startedAt?: Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    status: String;

}

const readingProgressSchema = new Schema<IReadingProgress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        readingId: {
            type: Schema.Types.ObjectId,
            ref: "Reading",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
            index: true, // useful for prize counting
        },

    },
    { timestamps: true }
);

// Prevent duplicate progress per user per reading
readingProgressSchema.index({ userId: 1, readingId: 1 }, { unique: true });

export const ReadingProgressModel = mongoose.model<IReadingProgress>(
    "ReadingProgress",
    readingProgressSchema
);