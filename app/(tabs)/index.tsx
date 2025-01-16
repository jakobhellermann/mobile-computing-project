import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from "expo-router";
import { Match } from '@/backend/shared';
import { fetchTeamLatestMatches, fetchTeamUpcomingMatches } from '@/src/api/league';
import { useNotifications } from '@/src/hooks/toast';
import { matchHeaderText } from '../pages/match_page';


export default function HomeScreen() {
  const router = useRouter();
  const [latestMatches, setLatestMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { showError } = useNotifications();

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        fetchTeamLatestMatches("%").then(setLatestMatches).catch(showError);
        fetchTeamUpcomingMatches("%").then(setUpcomingMatches).catch(showError);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, []);

  const handleMatchRouting = (matchId: string) => {
    console.log('Item pressed, navigating to TeamPage with Name:', matchId);
    router.push({
      pathname: "/pages/match_page",
      params: { entityName: matchId },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedText type='title'>News</ThemedText>
      {/* Latest Results */}
      <View>
        <Text style={styles.sectionTitle}>Latest Results</Text>
        {latestMatches.map((match: Match) => (
          <TouchableOpacity key={match.matchId} onPress={() => handleMatchRouting(match.matchId)}>
            <Card style={styles.matchCard}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchTitle}>{matchHeaderText(match)}</Text>
                <Text style={styles.matchSubtitle}>{match.tab + "\t" + match.tournament || 'Tournament Info'}</Text>
              </View>
              <Text style={styles.matchTime}>
                {new Date(match.dateTimeUTC).toLocaleTimeString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      {/* Upcoming Matches */}
      <View>
        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        {upcomingMatches.map((match: Match) => (
          <TouchableOpacity key={match.matchId} onPress={() => handleMatchRouting(match.matchId)}>
            <Card style={styles.matchCard}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchTitle}>
                  <Text style={styles.matchTitle}>{matchHeaderText(match)}</Text>
                </Text>
                <Text style={styles.matchSubtitle}>{match.tab + "\t\t" + match.tournament || 'Tournament Info'}</Text>
              </View>
              <Text style={styles.matchTime}>
                {new Date(match.dateTimeUTC).toLocaleTimeString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView >
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
    marginBottom: 8,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 40,
    height: 40,
    marginBottom: 4,
    borderRadius: 20,
  },
  teamImage: {
    width: 80, // Width of the custom icon
    height: 80, // Height of the custom icon
    marginBottom: 8, // Space between the image and the text
    borderRadius: 40, // Makes the image circular if it's a square
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
  matchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  matchInfo: {
    flex: 1,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  matchSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  matchTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
});
