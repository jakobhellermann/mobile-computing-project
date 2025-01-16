import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Match } from 'shared';
import { fetchHtHMatches, fetchMatch, fetchMatchRoster } from '@/src/api/league';
import { fetchApiImage } from '@/client/image_client';
import { formatDate } from '../(tabs)';

export default function MatchOverviewPage() {
  const router = useRouter();
  const { entityName } = useLocalSearchParams<{ entityName: string; }>();
  const [match, setMatch] = useState<Match>();
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [imageTeam1, setImage1] = useState<string | undefined>();
  const [imageTeam2, setImage2] = useState<string | undefined>();
  const [hthMatches, setHthMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleMatchRouting = (matchId: string) => {
    console.log('Item pressed, navigating to TeamPage with Name:', matchId);
    router.replace({
      pathname: "/pages/match_page",
      params: { entityName: matchId },
    });
  };

  //TODO Match Page
  useEffect(() => {
    const loadMatchData = async () => {
      try {
        console.log("Match page with Id", entityName);
        const match = await fetchMatch(entityName);
        console.log("Match:", match);
        const hthMatches = await fetchHtHMatches(match.team1, match.team2);
        const team1 = await fetchMatchRoster(match.matchId, match.team1);
        const team2 = await fetchMatchRoster(match.matchId, match.team2);
        console.log(entityName);
        setMatch(match);
        console.log(team1);
        console.log(team2);
        setTeam1(team1);
        setTeam2(team2);
        setHthMatches(hthMatches);

        fetchApiImage(match.team1.concat("logo_square.png")).then(setImage1);
        fetchApiImage(match.team2.concat("logo_square.png")).then(setImage2);

        //   const params = {
        //     action: 'cargoquery',
        //     format: 'json',
        //     origin: '*', // Required for CORS
        //     limit: 10,
        //     tables: 'ScoreboardTeams',
        //     fields: 'Roster, GameId, Team',
        //     where: `GameId LIKE "${entityName}_1" AND Team LIKE "${match.team1}"`,
        // };

        // try {
        //     // Perform the API request
        //     const response = await axios.get(API_URL, { params });

        //     // Convert the team map to an array
        //     console.log('API Response MatchRoster:', response.data.cargoquery[0].title.Roster);


        // } catch (error) {
        //     console.error('Error fetching tournament data:', error);
        //     throw error;
        // }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMatchData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  if (!match) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Match not found.</Text>
      </View>
    );
  }

  return (


    <ScrollView style={styles.container}>
      {/* Tournament Header */}
      <View style={styles.tournamentHeader}>
        <Ionicons name="play-circle" size={24} />
        <Text style={styles.tournamentName}>{match.tournament}</Text>
      </View>

      {/* Teams */}
      <View style={styles.teamsContainer}>

        <View style={styles.team}>
          <Image
            source={{ uri: imageTeam1 }} // Replace with your image URL
            style={styles.teamImage}
          />
          <Text style={styles.teamName}>{match.team1}</Text>
          <Text style={styles.vsText}>{match.team1Score}</Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.team}>
          <Image
            source={{ uri: imageTeam2 }} // Replace with your image URL
            style={styles.teamImage}
          />
          <Text style={styles.teamName}>{match.team2}</Text>
          <Text style={styles.vsText}>{match.team2Score}</Text>
        </View>
      </View>

      {/* Players */}
      <View style={styles.playersContainer}>
        <View key={"Top"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Top_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[0] || ""}</Text>
        </View>
        <View key={"Jungle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Jungle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[1] || ""}</Text>
        </View>
        <View key={"Middle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Middle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[2] || ""}</Text>
        </View>
        <View key={"Bottom"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Bottom_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[3] || ""}</Text>
        </View>
        <View key={"Support"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Support_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[4] || ""}</Text>
        </View>
      </View>

      <View style={styles.playersContainer}>
        <View key={"Top"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Top_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[0] || ""}</Text>
        </View>
        <View key={"Jungle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Jungle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[1] || ""}</Text>
        </View>
        <View key={"Middle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Middle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[2] || ""}</Text>
        </View>
        <View key={"Bottom"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Bottom_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[3] || ""}</Text>
        </View>
        <View key={"Support"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Support_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[4] || ""}</Text>
        </View>
      </View>

      {/* Head To Head Section */}
      <View>
        <Text style={styles.sectionTitle}>Latest Results</Text>
        {hthMatches.map((match: Match) => (
          <TouchableOpacity key={match.matchId} onPress={() => handleMatchRouting(match.matchId)}>
            <Card style={styles.matchCard}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchTitle}>{matchHeaderText(match)}</Text>
                <Text style={styles.matchSubtitle}>{match.tab + "\t" + match.tournament || 'Tournament Info'}</Text>
              </View>
              <Text style={styles.matchTime}>{formatDate(match.dateTimeUTC)}</Text>
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
  iconImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16, // Space above and below the container
  },
  team: {
    alignItems: "center", // Center content vertically
    marginHorizontal: 16, // Space between the teams
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginBottom: 8, // Space between the logo and name
  },
  teamName: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4, // Space between the name and score
  },
  teamScore: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  vsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 8, // Space around the "VS" text
  },
  teamImage: {
    width: 70,
    height: 70,
    marginBottom: 8, // Space between image and text
  },
  scoreText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 16, // Space between "VS" and teams
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  playersContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the grid
    gap: 12, // Add spacing between items
  },
  playerItem: {
    alignItems: "center", // Center icon and text
    margin: 8, // Space around each player item
    width: 40, // Ensure uniform width for all items
  },
  playerName: {
    textAlign: "center", // Center text under the image
    fontSize: 12,
    flexWrap: "wrap", // Allow text to wrap
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
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
});

export function matchHeaderText(match: Match) {
  let team = (name: string, score?: number) => score != null ? `${name} (${score})` : name;
  return `${team(match.team1, match.team1Score)} vs ${team(match.team2, match.team2Score)}`;
};