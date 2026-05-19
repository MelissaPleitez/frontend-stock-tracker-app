import { AuthResponse } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { useState } from "react";
import api from "../services/api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      return true;
    } catch (err) {
      console.log("Login error context:", err);

      if (err instanceof AxiosError) {
        const message = err.response?.data?.message;
        if (message === "Invalid credentials") {
          setError("Invalid email or password");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/auth/register", {
        email,
        password,
      });
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      return true;
    } catch {
      setError("Email already registered");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(false);
    await AsyncStorage.multiRemove(["token", "user"]);
  };

  const isAuthenticated = async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  };

  return { login, register, logout, isAuthenticated, loading, error };
};
