import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types";

const LOGIN_ROUTE: Href = "/(auth)/login";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem("user").then((userStr) => {
      if (userStr) setUser(JSON.parse(userStr));
    });
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace(LOGIN_ROUTE);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* User info */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#00d4aa" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>

      {/* App info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.infoRow}>
          <Ionicons name="trending-up" size={18} color="#888" />
          <Text style={styles.infoText}>
            Tracking: AAPL, GOOGL, MSFT, AMZN, TSLA
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="flash" size={18} color="#888" />
          <Text style={styles.infoText}>Real-time via Finnhub WebSocket</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="notifications" size={18} color="#888" />
          <Text style={styles.infoText}>
            Push notifications via Firebase FCM
          </Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ff4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  card: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00d4aa1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00d4aa44",
  },
  userInfo: {
    gap: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  userId: {
    fontSize: 13,
    color: "#888",
  },
  section: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#aaa",
  },
  logoutButton: {
    marginHorizontal: 24,
    backgroundColor: "#ff44441a",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ff444444",
  },
  logoutText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
