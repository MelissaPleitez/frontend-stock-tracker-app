import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import api from "../services/api";

export const useFCM = () => {
  useEffect(() => {
    const registerFCMToken = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) return;

        const fcmToken = await messaging().getToken();

        const userStr = await AsyncStorage.getItem("user");
        if (!userStr) return;

        const user = JSON.parse(userStr);

        await api.put("/auth/fcm-token", {
          userId: user.id,
          fcmToken,
        });

        console.log("FCM token sent to backend successfully");
      } catch (error) {
        console.error("FCM registration error:", error);
      }
    };

    registerFCMToken();

    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        console.log("FCM foreground message:", remoteMessage);
        Toast.show({
          type: "success",
          text1: remoteMessage.notification?.title ?? "🚨 Price Alert!",
          text2:
            remoteMessage.notification?.body ??
            "A stock reached your target price",
          visibilityTime: 5000,
          topOffset: 60,
        });
      },
    );

    const unsubscribeNotificationOpen = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log("Notification opened from background:", remoteMessage);
      },
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "App opened from quit state via notification:",
            remoteMessage,
          );
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpen();
    };
  }, []);
};
