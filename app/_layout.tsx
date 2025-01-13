import 'expo-dev-client';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import AuthProvider from "../src/modules/auth/AuthProvider";
import Toast from "react-native-toast-message";
import { usePushNotifications } from '@/src/push_notifications';

export default function RootLayout() {
  const { expoPushToken, lastNotification } = usePushNotifications({ onNotificationResponse: (res) => console.log(`got response ${JSON.stringify(res)}`) });

  return <AutocompleteDropdownContextProvider>
    <AuthProvider>
      <Stack >
        {/* <StatusBar style="auto" /> */}

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pages/tournament_page" options={{ headerShown: false }} />
        <Stack.Screen name="pages/team_page" options={{ headerShown: false }} />
        <Stack.Screen name="pages/match_page" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </AuthProvider>
  </AutocompleteDropdownContextProvider>;
}

