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
import { Linking } from 'react-native';
import { SubscriptionConfigIcons } from './subscriptions_page';
import { useNotifications } from '@/src/hooks/toast';

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

  const { showError } = useNotifications();

  const handleMatchRouting = (matchId: string) => {
    console.log('Item pressed, navigating to TeamPage with Name:', matchId);
    router.replace({
      pathname: "/pages/match_page",
      params: { entityName: matchId },
    });
  };

  const handleTournamentRouting = (overviewPage: string) => {
    console.log('Item pressed, navigating to TournamentPage with Name:', overviewPage);
    router.replace({
      pathname: "/pages/tournament_page",
      params: { entityName: overviewPage },
    });
  };

  const handleTeamRouting = (teamName: string) => {
    console.log('Item pressed, navigating to TeamPage with Name:', teamName);
    router.push({
      pathname: "/pages/team_page",
      params: { entityName: teamName },
    });
  };

  const handleOpenStream = (streamLink: string) => {
    Linking.openURL(streamLink).catch((err) =>
      console.error('Failed to open stream:', err)
    );
  };

  //TODO Match Page
  useEffect(() => {
    const loadMatchData = async () => {
      try {
        console.log("Match page with Id", entityName);
        const match = await fetchMatch(entityName);

        setMatch(match);
        fetchHtHMatches(match.team1, match.team2).then(setHthMatches).catch(showError);
        fetchMatchRoster(match.overviewPage, match.team1).then(setTeam1).catch(showError);
        fetchMatchRoster(match.overviewPage, match.team2).then(setTeam2).catch(showError);

        fetchApiImage(match.team1.concat("logo_square.png")).then(setImage1).catch(showError);
        fetchApiImage(match.team2.concat("logo_square.png")).then(setImage2).catch(showError);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMatchData();
  }, [entityName]);

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
      <TouchableOpacity key={match.overviewPage} onPress={() => handleTournamentRouting(match.overviewPage)}>
        <View style={styles.tournamentHeader}>
          <Ionicons name="trophy" size={24} />
          <Text style={styles.tournamentName}>{match.tournament}</Text>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            {/* Play Icon for Livestream */}
            {match.stream && (
              <TouchableOpacity onPress={() => handleOpenStream(match.stream)}>
                <Ionicons name="logo-twitch" size={24} />
              </TouchableOpacity>
            )}
            <SubscriptionConfigIcons type='match' name={entityName} />
          </View>

        </View>
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        <Text style={styles.dateStyle}>{formatDate(match.dateTimeUTC)}</Text>
        <Text style={styles.dateStyle}>{"Best of " + match.bestOf}</Text>
      </View>

      {/* Teams */}
      <View style={styles.teamsContainer}>


        <View style={styles.team}>
          <TouchableOpacity onPress={() => handleTeamRouting(match.team1)}>
            <Image
              source={{ uri: imageTeam1 }} // Replace with your image URL
              style={styles.teamImage}
            />
            <Text style={styles.teamName}>{match.team1}</Text>
          </TouchableOpacity>
          <Text style={styles.vsText}>{match.team1Score || 0}</Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.team}>
          <TouchableOpacity onPress={() => handleTeamRouting(match.team2)}>
            <Image
              source={{ uri: imageTeam2 }} // Replace with your image URL
              style={styles.teamImage}
            />
            <Text style={styles.teamName}>{match.team2}</Text>
          </TouchableOpacity>
          <Text style={styles.vsText}>{match.team2Score || 0}</Text>
        </View>
      </View>

      {/* Players */}
      <Text style={styles.rosterTitle}>{match.team1 + " Roster"}</Text>
      <View style={styles.playersContainer}>

        <View key={"Top"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Top_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[0] || "TBD"}</Text>
        </View>
        <View key={"Jungle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Jungle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[1] || "TBD"}</Text>
        </View>
        <View key={"Middle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Middle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[2] || "TBD"}</Text>
        </View>
        <View key={"Bottom"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Bottom_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[3] || "TBD"}</Text>
        </View>
        <View key={"Support"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Support_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team1[4] || "TBD"}</Text>
        </View>
      </View>
      <Text style={styles.rosterTitle}>{match.team2 + " Roster"}</Text>
      <View style={styles.playersContainer}>

        <View key={"Top"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Top_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[0] || "TBD"}</Text>
        </View>
        <View key={"Jungle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Jungle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[1] || "TBD"}</Text>
        </View>
        <View key={"Middle"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Middle_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[2] || "TBD"}</Text>
        </View>
        <View key={"Bottom"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Bottom_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[3] || "TBD"}</Text>
        </View>
        <View key={"Support"} style={styles.playerItem}>
          <Image
            source={require("../../assets/icons/Support_icon.png")} // Replace with your image URL
            style={styles.iconImage}
          />
          <Text style={styles.playerName}> {team2[4] || "TBD"}</Text>
        </View>
      </View>

      {/* Head To Head Section */}
      <View>
        <Text style={styles.sectionTitle}>Head-To-Head</Text>
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
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tournamentName: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateStyle: {
    marginLeft: 8,
    fontSize: 13,
    alignItems: "center",
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  team: {
    alignItems: "center",
    marginHorizontal: 16,
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginBottom: 8,
    resizeMode: 'contain'
  },
  teamName: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  teamScore: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  vsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  teamImage: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  rosterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 10,
  },
  playerItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  playerName: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    maxWidth: 80,
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
  let team = (name: string, score?: number) => score !== null ? `${name} (${score})` : name;
  return `${team(match.team1, match.team1Score)} vs ${team(match.team2, match.team2Score)}`;
};