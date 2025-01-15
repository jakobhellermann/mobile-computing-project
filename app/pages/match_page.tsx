import React, { useEffect, useState } from 'react';
import Team from '@/model/Team';
import Player from '@/model/Player';
import Match from '@/model/Match';
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { fetchLatestTeamMatches, fetchTeamData, fetchUpcomingTeamMatches } from '@/client/team_client';
import { fetchApiImage } from '@/client/image_client';
import { fetchMatch } from '@/client/match_client';

export default function MatchOverviewPage() {
  const router = useRouter();
  const { entityName } = useLocalSearchParams();
  const [match, setMatch] = useState<Match>();
  const [team1, setTeam1] = useState<Team>();
  const [team2, setTeam2] = useState<Team>();
  const [imageTeam1, setImage1] = useState<any>(null);
  const [imageTeam2, setImage2] = useState<any>(null);
  const [hthMatches, setHthMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //TODO Match Page
  // useEffect(() => {
  //     const loadTeamData = async () => {
  //       try {

  //         const match = await fetchMatch(entityName.toString());

  //         console.log(entityName);
  //         setMatch(match);
  //         //setTeam1(team); 
  //         //setImage(image);
  //         setHthMatches(hthMatches);
  //         //setUpcomingMatches(upcomingMatches)
  //       } catch (error) {
  //         console.error(error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     loadTeamData();
  //   }, []);

  //   if (loading) {
  //     return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  //   }

  //   if (!match) {
  //     return (
  //       <View style={styles.errorContainer}>
  //         <Text style={styles.errorText}>Team not found.</Text>
  //       </View>
  //     );
  //   }

  return (


    <ScrollView style={styles.container}>
      {/* Tournament Header */}
      <View style={styles.tournamentHeader}>
        <Ionicons name="play-circle" size={24} />
        <Text style={styles.tournamentName}>Tournament ABC</Text>
      </View>

      {/* Teams */}
      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          <Ionicons name="person-circle" size={80} />
          <Text style={styles.teamName}>Team 1</Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.team}>
          <Ionicons name="person-circle" size={80} />
          <Text style={styles.teamName}>Team 2</Text>
        </View>
      </View>

      {/* Players */}
      <View>
        {/* Team 1 Players */}
        <Text style={styles.sectionTitle}>Team 1</Text>
        <View style={styles.playersContainer}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={styles.playerItem}>
              <Ionicons name="person-circle-outline" size={40} />
              <Text style={styles.playerName}>Player {i + 1}</Text>
            </View>
          ))}
        </View>

        {/* Team 2 Players */}
        <Text style={styles.sectionTitle}>Team 2</Text>
        <View style={styles.playersContainer}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={styles.playerItem}>
              <Ionicons name="person-circle-outline" size={40} />
              <Text style={styles.playerName}>Player {i + 1}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Head To Head Section */}
      <View>
        <Text style={styles.sectionTitle}>Head To Head</Text>
        <Card style={styles.card}>
          <ThemedText>List item</ThemedText>
          <ThemedText>Supporting line text lorem ipsum dolor sit amet, consectetur.</ThemedText>
        </Card>
        <Card style={styles.card}>
          <ThemedText>List item</ThemedText>
          <ThemedText>Supporting line text lorem ipsum dolor sit amet, consectetur.</ThemedText>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tournamentName: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
  team: {
    alignItems: 'center',
  },
  teamName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  vsText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  playerItem: {
    alignItems: 'center',
  },
  playerName: {
    marginTop: 4,
    fontSize: 12,
  },
  card: {
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
});
