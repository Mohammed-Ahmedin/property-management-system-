import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  image: string;
}

const STORAGE_KEY = '@user_profile';

const defaultUser: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  image: 'https://i.pravatar.cc/300?img=12',
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      const updated = { ...user, ...updates };
      setUser(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Failed to update user:', error);
      return false;
    }
  }, [user]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(defaultUser);
      console.log('User logged out');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    updateUser,
    logout,
  }), [user, isLoading, updateUser, logout]);
});
