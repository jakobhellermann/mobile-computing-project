import 'expo-dev-client';
import { Stack } from "expo-router";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import AuthProvider from "../src/modules/auth/AuthProvider";
import Toast from "react-native-toast-message";
import { usePushNotifications } from '@/src/push_notifications';
import { SWRConfig } from 'swr';
import { apiFetch } from '@/src/api/base';
import { StrictMode } from 'react';

export default function RootLayout() {
  const { expoPushToken, lastNotification } = usePushNotifications({ onNotificationResponse: (res) => console.log(`got response ${JSON.stringify(res)}`) });

  return <AutocompleteDropdownContextProvider>
    <AuthProvider>
      <StrictMode></StrictMode>
      <SWRConfig value={{
        fetcher: (resource, init) => apiFetch(resource, init),
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

