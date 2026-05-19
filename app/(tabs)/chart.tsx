import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useStocks } from "../../hooks/useStocks";
import { StockQuote } from "../../types";

const { width } = Dimensions.get("window");

const StockChartCard = React.memo(({ stock }: { stock: StockQuote }) => {
  const isPositive = stock.change >= 0;
  const strokeColor = isPositive
    ? "rgba(0, 212, 170, 1)"
    : "rgba(255, 68, 68, 1)";

  return (
    <View style={styles.chartCard}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
        </View>
        <View style={styles.statsColumn}>
          <Text style={styles.statLabel}>Open</Text>
          <Text style={styles.statValue}>${stock.open.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Prev Close</Text>
          <Text style={styles.statValue}>
            ${stock.previousClose.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Chart */}
      <LineChart
        data={{
          labels: ["Prev", "Open", "Now"],
          datasets: [
            {
              data: [stock.previousClose, stock.open, stock.price],
              color: () => strokeColor,
              strokeWidth: 2,
            },
          ],
        }}
        width={width - 80}
        height={160}
        chartConfig={{
          backgroundColor: "#1a1a1a",
          backgroundGradientFrom: "#1a1a1a",
          backgroundGradientTo: "#1a1a1a",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => "#888",
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: strokeColor,
          },
          propsForBackgroundLines: {
            stroke: "#2a2a2a",
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
      />

      {/* Footer stats */}
      <View style={styles.cardFooter}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Low</Text>
          <Text style={[styles.statValue, { color: "#ff4444" }]}>
            ${stock.low.toFixed(2)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={[styles.statValue, { color: "#00d4aa" }]}>
            ${stock.high.toFixed(2)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Change</Text>
          <Text style={[styles.statValue, { color: strokeColor }]}>
            {isPositive ? "+" : ""}
            {stock.changePercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
});

export default function ChartScreen() {
  const { stocks, loading } = useStocks();

  if (loading && stocks.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00d4aa" />
      </View>
    );
  }

  return (
    <FlatList
      data={stocks}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => <StockChartCard stock={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Stock Charts</Text>
          <Text style={styles.subtitle}>Today's performance</Text>
        </View>
      }
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  loadingText: {
    color: "#888",
    fontSize: 16,
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
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  symbol: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  statsColumn: {
    alignItems: "flex-end",
    gap: 2,
  },
  chart: {
    borderRadius: 12,
    marginLeft: -10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  stat: {
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});
