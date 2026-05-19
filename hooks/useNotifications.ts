import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { InAppNotification, NotificationsResponse } from "../types";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get<NotificationsResponse>("/notifications");
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch {
      console.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await api.put("/notifications/read-all");
    } catch {
      console.error("Error marking notifications as read");
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllAsRead,
  };
};
