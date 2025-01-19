import { ThemedText } from '@/components/ThemedText';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { useRouter } from 'expo-router';
import { searchTeams, searchTournaments } from '@/src/api/league';

interface CustomAutocompleteDropdownItem extends AutocompleteDropdownItem {
  type?: string;
  searchParam?: string;
}

const SEARCHTYPE = Object.freeze({
  TOURNAMENT: "Turnier",
  TEAM: "Team"
});


export default function HomeScreen() {
  const router = useRouter();
  const searchRef = useRef<CustomAutocompleteDropdownItem>(null);
  const [suggestionsList, setSuggestionsList] = useState<AutocompleteDropdownItem[]>([]);

  const getSuggestions = useCallback(async (term: string) => {
    if (!term) {
      setSuggestionsList([]);
      return;
    }

    try {
      const tournaments = await searchTournaments(term); // Fetch tournaments
      const teams = await searchTeams(term);
      console.log("Found Teams", teams);
      const formattedSuggestions: CustomAutocompleteDropdownItem[] = tournaments.map((tournament, index) => ({
        id: index.toString(),
        title: tournament.name,
        type: SEARCHTYPE.TOURNAMENT,
        searchParam: tournament.overviewPage,
      }));
      const formattedSuggestionsTeams: CustomAutocompleteDropdownItem[] = teams.map((team, index) => ({
        id: index.toString(),
        title: team,
        type: SEARCHTYPE.TEAM,
        searchParam: team,
      }));
      setSuggestionsList(formattedSuggestions.concat(formattedSuggestionsTeams));
    } catch (error) {
      console.error('Error fetching search data:', error);
      setSuggestionsList([]);
    }
  }, []);

  const onSelectItem = useCallback((item: CustomAutocompleteDropdownItem | null) => {
    console.log(item);
    if (item) {

      if (item.type === SEARCHTYPE.TOURNAMENT) {
        router.push({
          pathname: "/pages/tournament_page",
          params: { entityName: item.searchParam },
        });
      } else {
        router.push({
          pathname: "/pages/team_page",
          params: { entityName: item.searchParam },
        });
      }

    }
  }, [router]);

  useEffect(() => {
    getSuggestions("");
  }, [getSuggestions]);

  const onClearPress = () => setSuggestionsList([]);

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
        renderItem={(item: CustomAutocompleteDropdownItem, text) =>
          <View style={{ padding: 15 }}>
            <Text style={{ color: 'black', fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: '#7d7d7d', fontSize: 12 }}>{item.type}</Text>
          </View>
        }
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
