import mongoose, { Schema, Document } from "mongoose";

// Define Question interface

interface Option {
    // id: string;       // e.g., "A", "B", or could be a uuid
    text: string;     // option text
}

interface Question {
    question: string;
    answer: string; // could also be an index if you want
    options: Option[];
}

const optionSchema = new Schema<Option>(
    {
        // id: { type: String, required: true },
        text: { type: String, required: true },
    },
    { _id: true }
);


// Define Quiz/Test Document interface
export interface QuizTestDocument extends Document {
    name: string;
    description?: string;
    grade: string;
    subject: string;
    type: "quiz" | "test" | "questQuiz";
    numberOfQuestions: number;
    time: number;
    questions: Question[];
    createdAt: Date;
    updatedAt: Date;
}

// Schema for Question
const questionSchema = new Schema<Question>(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        options: { type: [optionSchema], required: true },
    },
    { _id: true }
);

// Schema for Quiz/Test
const quizTestSchema = new Schema<QuizTestDocument>(
    {
        name: { type: String, required: true },
        description: { type: String },
        grade: { type: String, required: true },
        subject: { type: String, required: true },
        type: { type: String, enum: ["quiz", "test", "questQuiz"], required: true },
        numberOfQuestions: { type: Number, required: true },
        time: { type: Number, required: true }, // minutes
        questions: { type: [questionSchema], required: true },
    },
    { timestamps: true }
);

const QuizTestModel = mongoose.model<QuizTestDocument>(
    "QuizTest",
    quizTestSchema,
    "QuizTests"
);

export default QuizTestModel;