import socket from "@/services/socket";
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { StockQuote } from "../types";

export const useStocks = () => {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get<StockQuote[]>("/stocks");
      setStocks(response.data);
    } catch {
      setError("Failed to fetch live stocks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  useEffect(() => {
    socket.connect();

    const onPriceUpdate = ({
      symbol,
      price,
    }: {
      symbol: string;
      price: number;
    }) => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock.symbol === symbol ? { ...stock, price } : stock,
        ),
      );
    };

    socket.on("price_update", onPriceUpdate);

    return () => {
      socket.off("price_update", onPriceUpdate);
      socket.disconnect();
    };
  }, []);

  return { stocks, loading, error, refetch: fetchStocks };
};
