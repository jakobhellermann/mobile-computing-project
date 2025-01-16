import 'expo-dev-client';
import { Stack } from "expo-router";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import AuthProvider from "../src/modules/auth/AuthProvider";
import Toast from "react-native-toast-message";
import { usePushNotifications } from '@/src/push_notifications';
import { SWRConfig } from 'swr';
import { apiFetch } from '@/src/api/base';
import { StrictMode } from 'react';
import { useLinkTo } from '@react-navigation/native';
import { useNotifications } from '@/src/hooks/toast';

export default function RootLayout() {
  const { expoPushToken, lastNotification } = usePushNotifications({ onNotificationResponse: (res) => console.log(`got response ${JSON.stringify(res)}`) });

  const { showError } = useNotifications();

  return <AutocompleteDropdownContextProvider>
    <AuthProvider>
      <StrictMode></StrictMode>
      <SWRConfig value={{
        fetcher: (resource, init) => apiFetch(resource, init),
        shouldRetryOnError: false,
        onError: (error, key) => {
          console.log("got", error);
          if (error instanceof Error) {
            showError(error.message);

          }
        }
      }}>
        <Stack >
          {/* <StatusBar style="auto" /> */}

          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pages/tournament_page" options={{ title: "Tournament" }} />
          <Stack.Screen name="pages/team_page" options={{ title: "Team" }} />
          <Stack.Screen name="pages/match_page" options={{ title: "Match" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast />
      </SWRConfig>
    </AuthProvider>
  </AutocompleteDropdownContextProvider>;
}

