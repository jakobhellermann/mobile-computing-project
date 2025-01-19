import 'expo-dev-client';
import { Stack } from "expo-router";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import AuthProvider from "../src/modules/auth/AuthProvider";
import Toast from "react-native-toast-message";
import { usePushNotifications } from '@/src/push_notifications';
import { SWRConfig } from 'swr';
import { apiFetch } from '@/src/api/base';
import { useNotifications } from '@/src/hooks/toast';
import { LogBox } from 'react-native';

// We are using our own Popup Notifications for errors
LogBox.ignoreAllLogs();

export default function RootLayout() {
  return <AuthProvider>
    <AutocompleteDropdownContextProvider>
      <RootLayoutInner />
    </AutocompleteDropdownContextProvider>
  </AuthProvider>;
}

function RootLayoutInner() {
  usePushNotifications({
    onNotificationResponse: (res) => console.log(`got push notification`, res),
  });
  const { showError } = useNotifications();

  return <SWRConfig value={{
    fetcher: (resource, init) => apiFetch(resource, init),
    shouldRetryOnError: false,
    onError: (error, key) => {
      if (error instanceof Error) {
        if (error.cause instanceof Response && [401].includes(error.cause.status)) {
          return;
        }
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
      <Stack.Screen name="pages/subscriptions_page" options={{ title: "Subscriptions" }} />
      <Stack.Screen name="pages/calendar_detail_page" options={{ title: "Detail Page" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
    <Toast />
  </SWRConfig>;
}

