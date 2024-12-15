import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

export default function RootLayout() {
  return <AutocompleteDropdownContextProvider>
    <Stack >
      <StatusBar style="auto" />

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  </AutocompleteDropdownContextProvider>;
}
