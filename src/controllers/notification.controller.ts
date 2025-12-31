import { Request, Response } from "express";
import Notification from "../models/notification.model";
import { sendPushNotifications } from "../services/notification.service";

// Get user notifications with pagination
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const isRead = req.query.isRead as string; // "true", "false", or undefined for all

    const skip = (page - 1) * limit;

    const query: any = { userId };
    if (isRead === "true") query.isRead = true;
    if (isRead === "false") query.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ userId, isRead: false }),
    ]);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get unread count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({ userId, isRead: false });

    res.json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    console.error("Get Unread Count Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark single notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark as Read Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark single notification as unread
export const markAsUnread = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: false },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification marked as unread",
      data: notification,
    });
  } catch (error) {
    console.error("Mark as Unread Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark All as Read Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete single notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete all read notifications
export const deleteAllRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const result = await Notification.deleteMany({ userId, isRead: true });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} notifications`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete All Read Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Send notification to specific users (Admin)
export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { userIds, title, description, type, data } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "userIds array is required",
      });
    }

    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: "title, description, and type are required",
      });
    }

    const result = await sendPushNotifications(userIds, {
      title,
      description,
      type,
      data,
    });

    res.json(result);
  } catch (error) {
    console.error("Send Notification Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  sendNotification,
};