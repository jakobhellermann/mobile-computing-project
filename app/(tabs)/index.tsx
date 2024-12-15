import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedText type='title'>News</ThemedText>

      <View style={styles.cardList}>
        {[0, 1, 2, 3].map((_, i) => <Card style={{ flex: 1, flexDirection: "row", alignItems: "center" }} key={i}>
          <Ionicons name="notifications" size={24} style={{}} />
          <View >
            <ThemedText>some title</ThemedText>
            <ThemedText>some description</ThemedText>
          </View>
          <ThemedText style={{ marginLeft: "auto" }}>9:41 AM</ThemedText>
        </Card>)}
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
