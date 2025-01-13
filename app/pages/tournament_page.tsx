import React, { useEffect, useState } from 'react';
import Tournament from '../../model/Tournament';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { fetchTournamentData, fetchTournamentLogo } from '../../client/tournament_client';

export default function TournamentPage({ route }: any) {
  const {name = 'LEC 2024 Season Finals' } = route?.params || {}; // Default params
  const [tournament, setTournament] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTournamentData = async () => {
      try {
        const data = await fetchTournamentData(name);
        const image = await fetchTournamentLogo("SK_Gaming","SK_Gaminglogo_square.png")
        setTournament(data[0]); // Assuming we're interested in the first tournament
        setImage(image);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTournamentData();
  }, [name]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (!tournament) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tournament not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: image }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{tournament.name}</Text>
        </View>
        <View style={styles.profileIcons}>
          <Text>⭐</Text>
          <Text>🔔</Text>
        </View>
      </View>

      {/* General Info Section */}
      {/* General Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Info</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>Organizer</Text>
            <Text style={styles.tableValue}>{tournament.organizer || 'Unknown'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>Rulebook</Text>
            <Text style={styles.tableValue}>{tournament.rulebook || 'Not Available'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>Region</Text>
            <Text style={styles.tableValue}>{tournament.region}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>Event Type</Text>
            <Text style={styles.tableValue}>{tournament.eventType || 'N/A'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>Address</Text>
            <Text style={styles.tableValue}>{tournament.address || 'Unknown'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>Start Date</Text>
            <Text style={styles.tableValue}>{tournament.dateStart}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>End Date</Text>
            <Text style={styles.tableValue}>{tournament.endDate || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Teams Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teams</Text>
        {tournament.teams?.map((team: any, index: number) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemTitle}>{team.name}</Text>
            <FlatList
              data={team.players}
              keyExtractor={(item, idx) => `${team.name}-${idx}`}
              renderItem={({ item }) => (
                <View style={styles.playerItem}>
                  <Text style={styles.playerName}>{item.name}</Text>
                  <Text style={styles.playerRole}>{item.role}</Text>
                </View>
              )}
            />
          </View>
        ))}
      </View>

      {/* Bracket Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bracket</Text>
        <View style={styles.bracket}>
          {/* Matches - Replace with actual match data if available */}
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
  playerItem: {
    marginBottom: 4,
  },
  playerName: {
    fontSize: 12,
  },
  playerRole: {
    fontSize: 12,
    color: '#777',
  },
  table: {
    backgroundColor: '#EFEFEF',
    padding: 8,
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  tableKey: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  tableValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
    color: '#555',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});