import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useFCM } from "../../hooks/useFCM";
import { useNotifications } from "../../hooks/useNotifications";
import { useStocks } from "../../hooks/useStocks";
import { StockQuote } from "../../types";

const getChangeColor = (change: number) =>
  change >= 0 ? "#00d4aa" : "#ff4444";
const getChangeIcon = (change: number) =>
  change >= 0 ? "trending-up" : "trending-down";

const StockCard = React.memo(({ item }: { item: StockQuote }) => (
  <View style={styles.card}>
    <View style={styles.cardLeft}>
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text style={styles.detail}>
        H: ${item.high.toFixed(2)} L: ${item.low.toFixed(2)}
      </Text>
    </View>

    <View style={styles.cardRight}>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <View style={styles.changeRow}>
        <Ionicons
          name={getChangeIcon(item.change)}
          size={14}
          color={getChangeColor(item.change)}
        />
        <Text style={[styles.change, { color: getChangeColor(item.change) }]}>
          {item.changePercent.toFixed(2)}%
        </Text>
      </View>
    </View>
  </View>
));

const NOTIFICATIONS_ROUTE = "/notifications" as Href;

export default function StocksScreen() {
  useFCM();
  const { stocks, loading, error, refetch } = useStocks();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#ff4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && stocks.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00d4aa" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Stocks</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => router.push(NOTIFICATIONS_ROUTE)}
        >
          <Ionicons name="notifications-outline" size={24} color="#ffffff" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => <StockCard item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor="#00d4aa"
          />
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00d4aa",
  },
  liveText: {
    color: "#00d4aa",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  cardLeft: {
    gap: 6,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  detail: {
    fontSize: 12,
    color: "#888",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: "600",
  },
  separator: {
    height: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    gap: 16,
  },
  errorText: {
    color: "#888",
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#00d4aa",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bellButton: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
