import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import api from "../../services/api";
import { Alert as AlertType, CreateAlertPayload } from "../../types";

const TRACKED_SYMBOLS = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [symbol, setSymbol] = useState(TRACKED_SYMBOLS[0] ?? "AAPL");
  const [targetPrice, setTargetPrice] = useState("");

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await api.get<AlertType[]>("/alerts");
      setAlerts(response.data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not fetch alerts",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleCreateAlert = async () => {
    const price = parseFloat(targetPrice);

    if (!targetPrice || isNaN(price) || price <= 0) {
      Toast.show({
        type: "error",
        text1: "Invalid price",
        text2: "Please enter a valid target price",
      });
      return;
    }

    setCreating(true);
    try {
      const payload: CreateAlertPayload = { symbol, targetPrice: price };
      const response = await api.post<AlertType>("/alerts", payload);
      setAlerts((prev) => [response.data, ...prev]);
      setTargetPrice("");

      Toast.show({
        type: "success",
        text1: "Alert Created",
        text2: `${symbol} will notify you at $${price}`,
        visibilityTime: 3000,
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not create alert",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAlert = (id: number) => {
    Alert.alert(
      "Delete Alert",
      "Are you sure you want to remove this price threshold trigger?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/alerts/${id}`);
              setAlerts((prev) => prev.filter((a) => a.id !== id));
              Toast.show({
                type: "success",
                text1: "Alert deleted successfully",
              });
            } catch {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Could not delete alert from database",
              });
            }
          },
        },
      ],
    );
  };

  const renderAlert = ({ item }: { item: AlertType }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertLeft}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertSymbol}>{item.symbol}</Text>
          {item.triggered && (
            <View style={styles.triggeredBadge}>
              <Text style={styles.triggeredText}>Triggered</Text>
            </View>
          )}
        </View>
        <Text style={styles.alertPrice}>
          Target: ${item.targetPrice.toFixed(2)}
        </Text>
        <Text style={styles.alertDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handleDeleteAlert(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Price Alerts</Text>
        <Text style={styles.subtitle}>Get notified when price is reached</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Create Alert</Text>

        <View style={styles.symbolRow}>
          {TRACKED_SYMBOLS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.symbolChip,
                symbol === s && styles.symbolChipActive,
              ]}
              onPress={() => setSymbol(s)}
            >
              <Text
                style={[
                  styles.symbolChipText,
                  symbol === s && styles.symbolChipTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Target price"
            placeholderTextColor="#888"
            value={targetPrice}
            onChangeText={setTargetPrice}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={[styles.createButton, creating && styles.buttonDisabled]}
            onPress={handleCreateAlert}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="add" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#00d4aa" />
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAlert}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#888"
              />
              <Text style={styles.emptyText}>No alerts yet</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  form: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    gap: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  symbolRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symbolChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  symbolChipActive: {
    backgroundColor: "#00d4aa",
    borderColor: "#00d4aa",
  },
  symbolChipText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
  },
  symbolChipTextActive: {
    color: "#ffffff",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  createButton: {
    backgroundColor: "#00d4aa",
    borderRadius: 12,
    width: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  alertCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  alertLeft: {
    gap: 4,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertSymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  triggeredBadge: {
    backgroundColor: "#00d4aa22",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00d4aa",
  },
  triggeredText: {
    color: "#00d4aa",
    fontSize: 11,
    fontWeight: "600",
  },
  alertPrice: {
    fontSize: 14,
    color: "#888",
  },
  alertDate: {
    fontSize: 12,
    color: "#555",
  },
  deleteButton: {
    padding: 8,
  },
  separator: {
    height: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
});
