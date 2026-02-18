import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import User from "../models/user.model";
import Notification from "../models/notification.model";
import { deviceType } from "../utils/enums";
import serviceAccount from "../../androidNotification.json";

// Initialize Firebase Admin ONCE
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

interface NotificationPayload {
  title: string;
  description: string;
  type: string;
  data?: Record<string, any>;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function sendPushNotifications(
  userIds: string[],
  payload: NotificationPayload
) {
  try {
    const notifications = userIds.map((userId) => ({
      userId,
      title: payload.title,
      description: payload.description,
      type: payload.type,
      data:payload.data
    }));

    await Notification.insertMany(notifications);

    const users = await User.find(
      { _id: { $in: userIds }, deviceToken: { $ne: null } },
      { deviceType: 1, deviceToken: 1 }
    );

    const androidTokens: string[] = [];
    const iosTokens: string[] = [];

    users.forEach((u) => {
      if (!u.deviceToken) return;

      if (u.deviceType === deviceType.ANDROID || u.deviceType === deviceType.WEB) {
        androidTokens.push(u.deviceToken);
      } else if (u.deviceType === deviceType.IOS) {
        iosTokens.push(u.deviceToken);
      }
    });

    const messaging = getMessaging();
    const results = {
      android: { success: 0, failure: 0 },
      ios: { success: 0, failure: 0 },
    };

    if (androidTokens.length) {
      const batches = chunkArray(androidTokens, 500);

      for (const batch of batches) {
        const response = await messaging.sendEachForMulticast({
          tokens: batch,
          notification: {
            title: payload.title,
            body: payload.description,
          },
          data: payload.data
            ? Object.fromEntries(
                Object.entries(payload.data).map(([k, v]) => [k, String(v)])
              )
            : {},
          android: {
            priority: "high",
          },
        });

        results.android.success += response.successCount;
        results.android.failure += response.failureCount;

        if (response.failureCount > 0) {
          const invalidTokens: string[] = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              invalidTokens.push(batch[idx]);
            }
          });

          if (invalidTokens.length > 0) {
            await User.updateMany(
              { deviceToken: { $in: invalidTokens } },
              { $unset: { deviceToken: "" } }
            );
          }
        }
      }

      console.log(
        `Android: ${results.android.success} success, ${results.android.failure} failure`
      );
    }

    if (iosTokens.length) {
      const batches = chunkArray(iosTokens, 500);

      for (const batch of batches) {
        const response = await messaging.sendEachForMulticast({
          tokens: batch,
          notification: {
            title: payload.title,
            body: payload.description,
          },
          data: payload.data
            ? Object.fromEntries(
                Object.entries(payload.data).map(([k, v]) => [k, String(v)])
              )
            : {},
          apns: {
            payload: {
              aps: {
                sound: "default",
                contentAvailable: true,
              },
            },
          },
        });

        results.ios.success += response.successCount;
        results.ios.failure += response.failureCount;

        if (response.failureCount > 0) {
          const invalidTokens: string[] = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              invalidTokens.push(batch[idx]);
            }
          });

          if (invalidTokens.length > 0) {
            await User.updateMany(
              { deviceToken: { $in: invalidTokens } },
              { $unset: { deviceToken: "" } }
            );
          }
        }
      }

      console.log(
        `iOS: ${results.ios.success} success, ${results.ios.failure} failure`
      );
    }

    return { success: true, results };
  } catch (err) {
    console.error("Push Notification Error:", err);
    return { success: false, error: err };
  }
}