import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Card } from '@/components/Card';
import { fetchApiImage } from '@/client/image_client';
import { fetchTeam, fetchTeamLatestMatches, fetchTeamUpcomingMatches } from '@/src/api/league';
import { Team, Match, Player } from 'shared';


export default function TeamProfilePage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { entityName } = useLocalSearchParams<{ entityName: string; }>();
  const [team, setTeam] = useState<Team>();
  const [image, setImage] = useState<string | undefined>();
  const [latestMatches, setLatestMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  const handleMatchRouting = (matchId: string) => {
    console.log('Item pressed, navigating to TeamPage with Name:', matchId);
    router.push({
      pathname: "/pages/match_page",
      params: { matchId: matchId },
    });
  };

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const team = await fetchTeam(entityName);
        setTeam(team);
        navigation.setOptions({ title: team.name });

        fetchTeamLatestMatches(team.name).then(setLatestMatches);
        fetchTeamUpcomingMatches(team.name).then(setUpcomingMatches);
        fetchApiImage(team.name.concat("logo_square.png")).then(setImage);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (!team) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Team not found.</Text>
      </View>
    );
  }


  return (
    <ScrollView style={styles.container}>
      {/* Team Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: image }} // Replace with your image URL
          style={styles.teamImage}
        />
        <Text style={styles.teamName}>{team.name}</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Active Roster</Text>
      </View>

      {/* Player List */}
      <View style={styles.playersContainer}>
        <View key={"Top"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Top_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team.players[0].playerName}</Text>
        </View>
        <View key={"Jungle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Jungle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team.players[1].playerName}</Text>
        </View>
        <View key={"Middle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Middle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team.players[2].playerName}</Text>
        </View>
        <View key={"Bottom"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Bottom_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team.players[3].playerName}</Text>
        </View>
        <View key={"Support"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Support_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team.players[4].playerName}</Text>
        </View>
      </View>

      <View style={styles.table}>
        {team.players.map((player: Player) => (
          <View key={player.id} style={styles.tableRow}>
            <Text style={styles.tableKey}>{player.playerName}</Text>
            <Text style={styles.tableValue}>{player.name}</Text>
            <Text style={styles.tableValue}>{player.role}</Text>
          </View>
        ))}
      </View>

      {/* Latest Results */}
      <View>
        <Text style={styles.sectionTitle}>Latest Results</Text>
        {latestMatches.map((item: Match) => (
          <TouchableOpacity key={item.matchId} onPress={() => handleMatchRouting(item.matchId)}>
            <Card style={styles.matchCard}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchTitle}>
                  {`${item.team1} (${item.team1Score}) vs ${item.team2} (${item.team2Score})`}
                </Text>
                <Text style={styles.matchSubtitle}>{item.tab + "\t" + item.tournament || 'Tournament Info'}</Text>
              </View>
              <Text style={styles.matchTime}>
                {new Date(item.dateTimeUTC).toLocaleTimeString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
      {/* Upcoming Matches */}
      <View>
        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        {upcomingMatches.map((item: Match) => (
          <TouchableOpacity key={item.matchId} onPress={() => handleMatchRouting(item.matchId)}>
            <Card style={styles.matchCard}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchTitle}>
                  {`${item.team1} (${item.team1Score}) vs ${item.team2} (${item.team2Score})`}
                </Text>
                <Text style={styles.matchSubtitle}>{item.tab + "\t\t" + item.tournament || 'Tournament Info'}</Text>
              </View>
              <Text style={styles.matchTime}>
                {new Date(item.dateTimeUTC).toLocaleTimeString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
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
