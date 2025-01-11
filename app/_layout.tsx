import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import AuthProvider from "../src/modules/auth/AuthProvider";

//const Stack = createStackNavigator();

export default function RootLayout() {
  return <AutocompleteDropdownContextProvider>
    <AuthProvider>
      <Stack >
        <StatusBar style="auto" />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pages/tournament_page" options={{ headerShown: false }} />
        <Stack.Screen name="pages/team_page" options={{ headerShown: false }} />
        <Stack.Screen name="pages/match_page" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  </AutocompleteDropdownContextProvider>;
}

