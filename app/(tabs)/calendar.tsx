import { ThemedText } from '@/components/ThemedText';
import React, { } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title">TODO</ThemedText>
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
