import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image, FlatList } from 'react-native';

export default function TournamentPage() {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
          <Text style={styles.profileName}>LEC oder so</Text>
        </View>
        <View style={styles.profileIcons}>
          <Text>⭐</Text>
          <Text>🔔</Text>
        </View>
      </View>

      {/* General Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Info</Text>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>List item</Text>
          <Text style={styles.listItemSubtitle}>
            Supporting line text lorem ipsum dolor sit amet, consectetur.
          </Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>List item</Text>
          <Text style={styles.listItemSubtitle}>
            Supporting line text lorem ipsum dolor sit amet, consectetur.
          </Text>
        </View>
      </View>

      {/* Bracket Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bracket</Text>
        <View style={styles.bracket}>
          {/* Matches */}
          <View style={styles.match}>
            <View style={styles.matchTeam}>
              <Text>▶ Team 1</Text>
              <Text>1</Text>
            </View>
            <View style={styles.matchTeam}>
              <Text>▶ Team 2</Text>
              <Text>2</Text>
            </View>
          </View>
          <View style={styles.match}>
            <View style={styles.matchTeam}>
              <Text>▶ Team 1</Text>
              <Text>1</Text>
            </View>
            <View style={styles.matchTeam}>
              <Text>▶ Team 2</Text>
              <Text>2</Text>
            </View>
          </View>
          {/* Next Round */}
          <View style={styles.nextRound}>
            <View style={styles.matchTeam}>
              <Text>▶ Team 1</Text>
              <Text>1</Text>
            </View>
            <View style={styles.matchTeam}>
              <Text>▶ Team 2</Text>
              <Text>2</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Upcoming Matches Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        <View style={styles.upcomingMatch}>
          <Text style={styles.upcomingMatchText}>Team 1 vs Team 2</Text>
          <Text style={styles.upcomingMatchSubtitle}>CS 2 Major</Text>
          <Text>▶</Text>
          <Text style={styles.matchTime}>9:41 AM</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listItem: {
    backgroundColor: '#EFEFEF',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  bracket: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FFF',
  },
  match: {
    marginBottom: 8,
  },
  matchTeam: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nextRound: {
    borderTopWidth: 1,
    borderTopColor: '#D3D3D3',
    paddingTop: 8,
  },
  upcomingMatch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    padding: 8,
    borderRadius: 4,
  },
  upcomingMatchText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  upcomingMatchSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  matchTime: {
    fontSize: 12,
    color: '#777',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});
