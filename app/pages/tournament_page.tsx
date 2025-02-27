import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Card } from '@/components/Card';
import { Collapsible } from '@/components/Collapsible';
import { fetchTournament, fetchTournamentMatches, fetchTournamentTeams } from '@/src/api/league';
import { Tournament, Team, Match, Player } from 'shared';
import { useNotifications } from '@/src/hooks/toast';
import { IconButton } from '@/components/IconButton';
import { matchHeaderText } from './match_page';
import { formatDate } from '../(tabs)';
import { SubscriptionConfigIcons } from './subscriptions_page';
import { Ionicons } from '@expo/vector-icons';

type TournamentState = Tournament & {
  teams: Team[],
  matches: Match[],
};

export default function TournamentPage() {

  const { entityName: tournamentId } = useLocalSearchParams<{ entityName: string; }>();
  const [tournament, setTournament] = useState<TournamentState | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

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
      params: { entityName: matchId },
    });
  };

  useEffect(() => {
    const loadTournamentData = async () => {
      try {
        console.log(tournamentId);

        const tournament = await fetchTournament(tournamentId);
        if (!tournament) {
          showError(`Could not find tournament '${tournamentId}'`);
          return;
        }

        const [teams, matches] = await Promise.all([
          fetchTournamentTeams(tournament.overviewPage),
          fetchTournamentMatches(tournament.overviewPage),
        ]);
        setTournament({ ...tournament, teams, matches });

        navigation.setOptions({ title: tournament.name });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTournamentData();
  }, [tournamentId, navigation]);

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
          <Ionicons name="trophy" size={30} />
          <Text style={styles.profileName}>{" " + tournament.name}</Text>
        </View>
        <SubscriptionConfigIcons type='tournament' name={tournamentId} />
      </View>

      {/* General Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Info</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableKey}>Organizer</Text>
            <Text style={styles.tableValue}>{tournament.organizers || 'Unknown'}</Text>
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
            <Text style={styles.tableKey}>Start Date</Text>
            <Text style={styles.tableValue}>{tournament.dateStart}</Text>
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
        <Text style={styles.sectionTitle}>Tournament Matches</Text>
        {tournament.matches.map((match: Match) => (
          <TouchableOpacity key={match.matchId} onPress={() => handleMatchRouting(match.matchId)}>
            <Card style={styles.matchCard}>
              <View style={styles.matchInfo}>
                <Text style={styles.matchTitle}>{matchHeaderText(match)}</Text>
                <Text style={styles.matchSubtitle}>{match.tab || 'Tournament Info'}</Text>
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