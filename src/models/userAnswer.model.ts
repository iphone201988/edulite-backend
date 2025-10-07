import mongoose, { Schema, Document, Types } from "mongoose";

interface AnswerItem {
  questionId: Types.ObjectId; // reference to QuizTest questions
  selectedOptionId: Types.ObjectId; // reference to the option user selected
  isCorrect?: boolean; // calculated
}

export interface UserResponseDocument extends Document {
  userId: Types.ObjectId; // reference to User
  quizId: Types.ObjectId; // reference to QuizTest
  type: "quiz" | "test";
  answers: AnswerItem[];
  timeTaken: number; // in seconds
  points: number; // correct * 10
  correctCount: number;
  incorrectCount: number;
  createdAt: Date;
  updatedAt: Date;
  status:String;
}

const answerItemSchema = new Schema<AnswerItem>(
  {
    questionId: { type: Schema.Types.ObjectId, required: true },
    selectedOptionId: { type: Schema.Types.ObjectId, required: true },
    isCorrect: { type: Boolean },
  },
  { _id: false }
);

const userResponseSchema = new Schema<UserResponseDocument>(
  {
    status:{type:String,default:"in-progress"},
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "QuizTest", required: true },
    type: { type: String, enum: ["quiz", "test"], required: true },
    answers: { type: [answerItemSchema], required: true },
    timeTaken: { type: Number, required: true },
    points: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserResponseModel = mongoose.model<UserResponseDocument>(
  "UserResponse",
  userResponseSchema,
  "UserResponses"
);

export default UserResponseModel;
