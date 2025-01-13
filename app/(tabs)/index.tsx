import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";


export default function HomeScreen() {
  const router = useRouter();

  const handleItemPress = (id: number) => {
    console.log('Item pressed, navigating to TournamentPage with ID:', id);
    router.push("/pages/tournament_page");
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedText type='title'>News</ThemedText>

      <View style={styles.cardList}>
        {[0, 1, 2, 3].map((_, i) => (
          <TouchableOpacity key={i} onPress={() => handleItemPress(i)}>
            <Card style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="notifications" size={24} />
              <View>
                <ThemedText>some title</ThemedText>
                <ThemedText>some description</ThemedText>
              </View>
              <ThemedText style={{ marginLeft: 'auto' }}>9:41 AM</ThemedText>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.cardList}>
        <ThemedText style={{ marginTop: 24 }} type='title'>Upcoming Matches</ThemedText>
        {[...Array(10)].map((_, i) => <Card style={{ flexDirection: "row", alignItems: "center" }} key={i}>
          <Ionicons name="notifications" size={24} style={{}} />
          <View>
            <ThemedText>Team 1 vs Team 2</ThemedText>
            <ThemedText>CS 2 Major</ThemedText>
          </View>
          <ThemedText style={{ marginLeft: "auto" }}>9:41 AM</ThemedText>
        </Card>)}
      </View>
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
