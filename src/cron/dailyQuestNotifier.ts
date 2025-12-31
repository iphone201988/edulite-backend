import cron from "node-cron";
import DailyQuestModel from "../models/quest.model";
import { sendNotificationToAllUsers } from "../utils/notification.helper";
import { NotificationType } from "../utils/enums";


// Helper to get today's date range (midnight to next midnight)
function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

// Cron job scheduled every day at 8:00 AM server time
cron.schedule("0 8 * * *", async () => {
  try {
    const { start, end } = getTodayRange();

    const todaysQuests = await DailyQuestModel.find({
      date: { $gte: start, $lte: end },
    });

    if (!todaysQuests.length) return;

    for (const quest of todaysQuests) {
      await sendNotificationToAllUsers({
        title: "📅 Today's Daily Quest!",
        description: `Don't forget to complete: ${quest.name}`,
        type: NotificationType.DAILY_QUEST,
        data: {
          questId: String(quest._id),
          questType: quest.questType,
          type: quest.type,
        },
      });
    }

    console.log(`Daily Quest notifications sent for ${todaysQuests.length} quest(s)`);
  } catch (error) {
    console.error("Error sending Daily Quest notifications:", error);
  }
});
