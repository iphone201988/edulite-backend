import { NotificationMessagePayload } from "firebase-admin/messaging";
import User from "../models/user.model";
import { sendPushNotifications } from "../services/notification.service";

export async function sendNotificationToAllUsers(payload: any) {
  try {
    // Fetch only users that might have device tokens
    const users = await User.find(
      { deviceToken: { $ne: null } },
      { _id: 1 }
    );

    const userIds = users.map((u) => u._id.toString());

    if (!userIds.length) {
      return { success: false, message: "No users with device tokens found." };
    }

    return await sendPushNotifications(userIds, payload);
  } catch (err) {
    console.error("Broadcast Notification Error:", err);
    return { success: false, error: err };
  }
}