import Prize from "../models/prize.model";
import UserResponseModel from "../models/userAnswer.model";
import UserPrize from "../models/userPrize.model";

export const checkAndAssignQuizPrizes = async (userId: string) => {
  const completedQuizCount = await UserResponseModel.countDocuments({
    userId,
    type: "quiz",
    status: "completed",
  });

  const prizes = await Prize.find({
    requirement_type: "quiz_count",
    requirement_value: { $lte: completedQuizCount },
  });

  for (const prize of prizes) {
    const alreadyAssigned = await UserPrize.exists({
      user: userId,
      prize: prize._id,
    });

    if (!alreadyAssigned) {
      await UserPrize.create({
        user: userId,
        prize: prize._id,
      });
    }
  }
};