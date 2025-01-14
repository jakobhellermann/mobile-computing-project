import { ThemedText } from '@/components/ThemedText';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { fetchTournamentData } from '@/client/tournament_client';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  const router = useRouter();
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState<AutocompleteDropdownItem[]>([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const getSuggestions = useCallback(async (q: string) => {
    if (!q) {
      setSuggestionsList([]);
      return;
    }

    try {
      setLoading(true);
      const tournaments = await fetchTournamentData(q); // Fetch tournaments
      const formattedSuggestions = tournaments.map((tournament: any, index: number) => ({
        id: index.toString(),
        title: `${tournament.name}`, // TODO:change Format
        //title: `${tournament.name}\n${tournament.eventType || ''}`, 
        tournamentData: tournament,
      }));
      setSuggestionsList(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching tournament data:', error);
      setSuggestionsList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSelectItem = useCallback((item: AutocompleteDropdownItem | null) => {
    if (item) {
      router.push({
        pathname: "/pages/tournament_page", 
        params: { entityName: item.title }, 
      });
    }
  }, [router]);

  useEffect(() => {
    getSuggestions("");
  }, []);

  const onClearPress = useCallback(() => {
    setLoading(true);
    setSuggestionsList([]);
    setLoading(false);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <ThemedText type='title'>Search</ThemedText>
      <AutocompleteDropdown
        ref={searchRef}
        dataSet={suggestionsList}
        onChangeText={getSuggestions}
        debounce={500}
        onClear={onClearPress}
        onSelectItem={onSelectItem}
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
        textInputProps={{
          style: {
            backgroundColor: "#ece6f0",
            color: 'black'
          }
        }}
        inputContainerStyle={{
          backgroundColor: '#ece6f0',
          borderRadius: 12,
          padding: 8,
        }}
        suggestionsListContainerStyle={{
          backgroundColor: '#ece6f0',
        }}
        renderItem={(item, text) => <Text style={{ color: 'black', padding: 15 }}>{item.title}</Text>}
      />
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  cardList: {
    gap: 8,
  },
});
