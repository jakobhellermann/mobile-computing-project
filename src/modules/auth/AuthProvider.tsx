import { User } from 'shared';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { AuthContext } from './context';
import * as React from "react";


import * as SecureStore from "expo-secure-store";
import { Platform } from 'react-native';
import { apiFetch } from '@/src/api/base';

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

export function getAuthToken(): Promise<string | null> {
  return storageUtil.getItem(SECURE_STORY_KEY_LOGIN_TOKEN);
}

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
      console.warn("No login token found");
      setUser(null);
      return;
    }

    setIsLoading(true);
    apiFetch<User>("/user", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then((user) => {
      console.log(user);
      setUser(user);

    })
      .catch(async (e: Error) => {
        console.error(e);
        if (e.cause instanceof Response) {
          if (e.cause.status == 401) {
            console.warn("saved token is not authorized anymore");
            await storageUtil.deleteItem(SECURE_STORY_KEY_LOGIN_TOKEN);
            setUser(null);
          } else {
            throw new Error('Unexpected error');
          }
        }
      });

  };

  /**
   * Logout.
   * 
   * Logs the user out.
   */
  const logout = () => {
    return apiFetch("/logout", { method: "POST" })
      .catch(console.error) // logout should never fail
      .then(() => storageUtil.deleteItem(SECURE_STORY_KEY_LOGIN_TOKEN))
      .then(() => setUser(null));
  };

  const setLoginToken = async (token: string) => {
    await storageUtil.setItem(SECURE_STORY_KEY_LOGIN_TOKEN, token);
    await fetchUser();
  };


  const setPushToken = async (pushToken: string) => {
    await apiFetch(`/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ pushToken }),
    });
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
        setLoginToken,
        setPushToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
