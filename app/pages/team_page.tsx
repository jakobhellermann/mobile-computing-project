import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';

export default function TeamProfilePage() {
  return (
    <ScrollView style={styles.container}>
      {/* Team Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} />
        <Text style={styles.teamName}>Team 1</Text>
      </View>

      {/* Player List */}
      <View style={styles.playersContainer}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={styles.playerItem}>
            <Ionicons name="person-circle-outline" size={40} />
            <Text style={styles.playerName}>Player {i + 1}</Text>
          </View>
        ))}
      </View>

      {/* Latest Results */}
      <View>
        <Text style={styles.sectionTitle}>Latest Results</Text>
        <Card style={styles.card}>
          <ThemedText>List item</ThemedText>
          <ThemedText>Supporting line text lorem ipsum dolor sit amet, consectetur.</ThemedText>
        </Card>
        <Card style={styles.card}>
          <ThemedText>List item</ThemedText>
          <ThemedText>Supporting line text lorem ipsum dolor sit amet, consectetur.</ThemedText>
        </Card>
      </View>

      {/* Upcoming Matches */}
      <View>
        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        <TouchableOpacity>
          <Card style={styles.matchCard}>
            <Ionicons name="play-circle" size={24} />
            <View>
              <ThemedText>Team 1 vs Team 2</ThemedText>
              <ThemedText>CS 2 Major</ThemedText>
            </View>
            <ThemedText style={{ marginLeft: 'auto' }}>9:41 AM</ThemedText>
          </Card>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  teamName: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  playerItem: {
    alignItems: 'center',
  },
  playerName: {
    marginTop: 4,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    padding: 16,
    marginBottom: 8,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
});
