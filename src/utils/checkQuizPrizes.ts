import Prize from "../models/prize.model";
import UserResponseModel from "../models/userAnswer.model";
import UserPrize from "../models/userPrize.model";
import { sendPushNotifications } from "../services/notification.service";
import { NotificationType } from "./enums";

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
      const userPrize = await UserPrize.create({
        user: userId,
        prize: prize._id,
      });

      await sendPushNotifications([userId], {
        title: "🎉 You unlocked a prize!",
        description: `You earned: ${prize.name}`,
        type: NotificationType.BADGE,
        data: {
          userPrize
        },
      })
    }
  };
}