import { User } from 'shared';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { AuthContext } from './context';
import * as React from "react";


import * as SecureStore from "expo-secure-store";
import { Platform } from 'react-native';
import { BASE_URL } from '@/src/api/constants';

const SECURE_STORY_KEY_LOGIN_TOKEN = "loginToken";

const storageUtil = {
  setItem: async (k: string, v: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(k, v);
    } else {
      await SecureStore.setItemAsync(k, v);
    }
  },
  getItem: async (k: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(k);
    } else {
      return await SecureStore.getItemAsync(k);
    }
  },
  deleteItem: async (k: string) => {
    if (Platform.OS === 'web') {
      return localStorage.removeItem(k);
    } else {
      return await SecureStore.deleteItemAsync(k);
    }
  }
};

/**
 * Auth provider.
 * 
 * The auth provider manages the user authentication state.
 * It provides the user and the fetchUser and logout functions.
 * 
 * @returns {ReactElement} The auth provider.
 */
export default function AuthProvider({
  children,
}: PropsWithChildren<unknown>): ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch user.
   * 
   * Fetches the user from the api.
   */
  const fetchUser = async () => {

    let token = await storageUtil.getItem(SECURE_STORY_KEY_LOGIN_TOKEN);
    if (!token) {
      console.warn("No token found");
      setUser(null);
      return;
    }

    try {
      setIsLoading(true);
      let response = await fetch(`${BASE_URL}/api/user`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status == 401)
          throw new Error('Unauthorized');
        else
          throw new Error('Unexpected error');
      }
      let user = await response.json();
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout.
   * 
   * Logs the user out.
   */
  const logout = async () => {
    await storageUtil.deleteItem(SECURE_STORY_KEY_LOGIN_TOKEN);

    fetch(`${BASE_URL}/api/logout`, {
      method: 'POST',
    }).then(() => {
      setUser(null);
    });
  };

  const loginToken = async (token: string) => {
    await storageUtil.setItem(SECURE_STORY_KEY_LOGIN_TOKEN, token);
    await fetchUser();
  };


  useEffect(() => {
    fetchUser();
  }, []);

  // if (isLoading) {
  // return <></>;
  // }

  return (
    <AuthContext.Provider
      value={{
        user,
        fetchUser,
        loginToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
