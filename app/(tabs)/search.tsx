import { ThemedText } from '@/components/ThemedText';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';


export default function HomeScreen() {
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState<AutocompleteDropdownItem[]>([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const getSuggestions = useCallback((q: string) => {
    setSuggestionsList([{
      id: "0",
      title: "Team 1\nCounter Strike 2"
    },
    {
      id: "2",
      title: "Tournament B\nLeague of Legends"
    },
    {
      id: "3",
      title: "Dota 2\nMOBA By Valve Software"
    }
    ]);
  }, []);

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
