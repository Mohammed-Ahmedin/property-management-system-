// src/providers/auth.provider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

type AuthContextType = {
  token: string | null;
  setToken: (newToken: string | null) => Promise<void>;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: async () => {},
  isReady: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        setTokenState(storedToken);
        setIsReady(true);
      } catch (err) {
        console.error("Failed to load token", err);
      } finally {
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  const setToken = async (newToken: string | null) => {
    try {
      if (newToken) {
        await AsyncStorage.setItem("authToken", newToken);
      } else {
        await AsyncStorage.removeItem("authToken");
      }
      setTokenState(newToken);
    } catch (err) {
      console.error("Failed to save token", err);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
