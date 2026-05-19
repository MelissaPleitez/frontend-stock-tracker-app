import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNotifications } from "../hooks/useNotifications";
import { InAppNotification } from "../types";

const NotificationCard = ({ item }: { item: InAppNotification }) => (
  <View style={[styles.card, !item.isRead && styles.cardUnread]}>
    <View style={styles.cardLeft}>
      <View style={[styles.dot, item.isRead && styles.dotRead]} />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMessage}>{item.message}</Text>
      <Text style={styles.cardDate}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  </View>
);

export default function NotificationsScreen() {
  const { notifications, unreadCount, loading, markAllAsRead } =
    useNotifications();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.subtitle}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.readAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.readAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#00d4aa" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <NotificationCard item={item} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#888"
              />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubtext}>
                Create a price alert and we'll notify you here
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 12,
    color: "#00d4aa",
    marginTop: 2,
  },
  readAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  readAllText: {
    color: "#00d4aa",
    fontSize: 12,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  cardUnread: {
    borderColor: "#00d4aa44",
    backgroundColor: "#00d4aa0a",
  },
  cardLeft: {
    marginRight: 12,
    paddingTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00d4aa",
  },
  dotRead: {
    backgroundColor: "#444",
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
  cardMessage: {
    fontSize: 13,
    color: "#aaa",
    lineHeight: 18,
  },
  cardDate: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
  },
  separator: {
    height: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    gap: 12,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#555",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
