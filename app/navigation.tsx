import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from './(tabs)/index';
import TournamentPage from './(tabs)/tournament_page';

// Define the route parameter list
export type RootStackParamList = {
  Feed: undefined;
  Tournament: { id: number }; // Tournament route expects an 'id' parameter
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Tournament" component={TournamentPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}