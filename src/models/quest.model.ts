import mongoose, { Schema, Document } from "mongoose";

export interface IDailyQuest extends Document {
    date: Date;
    type: "reading" | "test" | "quiz";
    questType: "single" | "team";
    testQuizId?: mongoose.Types.ObjectId; // reference to test/quiz
    readingId?: mongoose.Types.ObjectId;  // reference to reading
    createdAt?: Date;
    updatedAt?: Date;
    class: string;
    name: string;
}

const dailyQuestSchema = new Schema<IDailyQuest>(
    {
        date: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            enum: ["questReading","questQuiz"],
            required: true,
        },
        questType: {
            type: String,
            enum: ["single", "team"],
            required: true,
        },
        testQuizId: {
            type: Schema.Types.ObjectId,
            ref: "QuizTest", // replace with your actual model name
        },

        readingId: {
            type: Schema.Types.ObjectId,
            ref: "Reading", // replace with your actual model name
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        class: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export const DailyQuestModel = mongoose.model<IDailyQuest>(
    "DailyQuest",
    dailyQuestSchema
);

export default DailyQuestModel;