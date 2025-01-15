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
import { Collapsible } from '@/components/Collapsible';
import { fetchTournamentMatches, fetchTournamentTeams, searchTournaments } from '@/src/api/league';
import { fetchTournamentLogo } from '@/client/tournament_client';
import { Tournament, Team, Match, Player } from 'shared';
import { useNotifications } from '@/src/hooks/toast';
import { IconButton } from '@/components/IconButton';
import { useSubscriptions } from '@/src/hooks/subscriptions';

type TournamentState = Tournament & {
  teams: Team[],
  matches: Match[],
};

export default function TournamentPage() {

  const { entityName } = useLocalSearchParams<{ entityName: string; }>();
  const [tournament, setTournament] = useState<TournamentState | undefined>();
  const [image, setImage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const { data: subscriptions, createSubscription } = useSubscriptions();

  const router = useRouter();
  const navigation = useNavigation();
  const { showError } = useNotifications();

  const handleTeamRouting = (teamName: string) => {
    console.log('Item pressed, navigating to TeamPage with Name:', teamName);
    router.push({
      pathname: "/pages/team_page",
      params: { entityName: teamName },
    });
  };

  const handleMatchRouting = (matchId: string) => {
    console.log('Item pressed, navigating to TeamPage with Name:', matchId);
    router.push({
      pathname: "/pages/match_page",
      params: { matchId },
    });
  };


  const toggleNotifications = () => {

  };
  const toggleFavorite = () => { };

  useEffect(() => {
    const loadTournamentData = async () => {
      try {
        console.log(entityName);

        const results = await searchTournaments(entityName);
        if (results.length === 0) {
          showError(`Could not find tournament '${entityName}'`);
          return;
        }
        // Assuming we're interested in the first tournament. TODO: add method returning a single tournament
        const tournament = results[0];

        const [teams, matches] = await Promise.all([
          fetchTournamentTeams(tournament.overviewPage),
          fetchTournamentMatches(tournament.overviewPage),
        ]);
        setTournament({ ...tournament, teams, matches });

        fetchTournamentLogo("SK_Gaming", "SK_Gaminglogo_square.png").then(setImage);

        navigation.setOptions({ title: tournament.name });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTournamentData();
  }, [entityName]);

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
          <IconButton onPress={toggleFavorite} name='star' size={24} />
          <IconButton onPress={toggleNotifications} name='notifications-on' size={24} />
        </View>
      </View>

      {/* General Info Section */}
      {/* General Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Info</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>Organizer</Text>
            <Text style={styles.tableValue}>{tournament.organizers || 'Unknown'}</Text>
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
            <Text style={styles.tableValue}>{'Unknown (TODO)'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>Start Date</Text>
            <Text style={styles.tableValue}>{tournament.dateStart}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>End Date</Text>
            <Text style={styles.tableValue}>{'N/A (TODO)'}</Text>
          </View>
        </View>
      </View>

      {/* Teams Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teams</Text>
        {tournament.teams?.map((team: Team) => (
          <Collapsible key={team.name} title={team.name} style={styles.listItem}
            extraButton={<IconButton onPress={() => handleTeamRouting(team.name)} name="read-more" />}>
            {team.players.map((player: Player, index) => (
              <View key={index} style={styles.playerItem}>
                <Text style={styles.playerName}>{player.playerName}</Text>
                <Text style={styles.playerRole}>{player.role}</Text>
              </View>
            ))}
          </Collapsible>
        ))}
      </View>

      {/* Matches Section */}
      <View>
        <Text style={styles.sectionTitle}>Latest Results</Text>
        {tournament.matches.map((item: Match) => (
          <TouchableOpacity key={item.matchId} onPress={() => handleMatchRouting(item.matchId)}>
            <Card style={styles.matchCard}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchTitle}>
                  {`${item.team1} (${item.team1Score}) vs ${item.team2} (${item.team2Score})`}
                </Text>
                <Text style={styles.matchSubtitle}>{item.tab || 'Tournament Info'}</Text>
              </View>
              <Text style={styles.matchTime}>
                {new Date(item.dateTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    maxWidth: "80%",
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
    flexShrink: 1,
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
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
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
  goBackButton: {
    padding: 8,
  },
  goBackText: {
    fontSize: 16,
    color: "#007bff",
  },
});