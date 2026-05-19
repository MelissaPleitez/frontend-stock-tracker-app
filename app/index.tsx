import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      setRoute(token ? "/(tabs)/stocks" : "/(auth)/login");
    });
  }, []);

  if (!route) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={route as any} />;
}
