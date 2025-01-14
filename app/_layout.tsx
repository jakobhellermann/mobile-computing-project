import 'expo-dev-client';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import AuthProvider, { getAuthToken } from "../src/modules/auth/AuthProvider";
import Toast from "react-native-toast-message";
import { usePushNotifications } from '@/src/push_notifications';
import { SWRConfig } from 'swr';
import { BASE_URL } from '@/src/api/constants';
import { StrictMode } from 'react';

export default function RootLayout() {
  const { expoPushToken, lastNotification } = usePushNotifications({ onNotificationResponse: (res) => console.log(`got response ${JSON.stringify(res)}`) });

  return <AutocompleteDropdownContextProvider>
    <AuthProvider>
      <StrictMode></StrictMode>
      <SWRConfig value={{
        fetcher: async (resource) => {
          let token = await getAuthToken();
          let res = await fetch(`${BASE_URL}/${resource}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          console.log(res);

          if (!res.ok) {
            let data: { message: string; error: string; } = await res.json();
            throw new Error(`failed to fetch ${resource}: ${data.message}`, { cause: res });
          } {
            return await res.json();
          }
        }
      }}>
        <Stack >
          {/* <StatusBar style="auto" /> */}

          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pages/tournament_page" options={{ headerShown: false }} />
          <Stack.Screen name="pages/team_page" options={{ headerShown: false }} />
          <Stack.Screen name="pages/match_page" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </SWRConfig>
    </AuthProvider>
  </AutocompleteDropdownContextProvider>;
}

