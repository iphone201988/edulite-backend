// controllers/prize.controller.ts
import Prize from "../models/prize.model";
import UserResponseModel from "../models/userAnswer.model";
import UserPrize from "../models/userPrize.model";

/**
 * Checks user's completed quizzes/tests and assigns eligible prizes
 */
export const checkAndAssignQuizPrizes = async (userId: string) => {
    try {
        // 1️⃣ Fetch all quiz/test prizes
        const quizPrizes = await Prize.find({ requirement_type: "quiz_count" });

        // 2️⃣ Count quizzes/tests completed by user
        const completedCount = await UserResponseModel.countDocuments({
            userId,
            type: { $in: ["quiz", "test"] },
            status: "completed" // assuming you mark completed responses
        });

        // 3️⃣ Loop through prizes and assign if requirement met
        for (const prize of quizPrizes) {
            if (completedCount >= prize.requirement_value) {
                const alreadyAssigned = await UserPrize.findOne({
                    user: userId,
                    prize: prize._id,
                });
                if (!alreadyAssigned) {
                    await UserPrize.create({ user: userId, prize: prize._id });
                }
            }
        }
    } catch (err) {
        console.error("Error checking/assigning quiz prizes:", err);
    }
};