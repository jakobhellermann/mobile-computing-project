import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { formatDate, formatDateOnly } from "../(tabs)";
import { fetchUpcomingEvents } from "@/src/api/league";
import { groupBy } from "@/src/utils";
import { useNotifications } from "@/src/hooks/toast";
import { Match, UpcomingEvent } from "shared";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "@/components/Card";
import { matchHeaderText } from "./match_page";

export default function CalendarDetailPage() {
    const router = useRouter();
    const navigation = useNavigation();
    const { entityName } = useLocalSearchParams<{ entityName: string; }>();
    const { showError } = useNotifications();

    const [todaysEvents, setTodaysEvents] = useState<UpcomingEvent[]>([]);

    useEffect(() => {
        fetchUpcomingEvents()
            .then(upcomingEvents => {
                let groups = groupBy(upcomingEvents, x => new Date(x.timestamp).toISOString().substring(0, 10));
                setTodaysEvents(groups[entityName] ?? []);
            })
            .catch(showError);
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: formatDateOnly(entityName),
        });

    }, [entityName]);

    function handleMatchRouting(matchId: string): void {
        router.push({
            pathname: "/pages/calendar_detail_page",
            params: { entityName: matchId },
        });
    }

    return <View style={styles.container}>
        <Text style={styles.sectionTitle}>Upcoming Matches</Text>
        {todaysEvents.map(event =>
            <TouchableOpacity key={event.matchId} onPress={() => handleMatchRouting(event.matchId)}>
                <Card style={styles.matchCard}>
                    <View style={styles.matchInfo}>
                        <Text style={styles.matchTitle}>
                            <Text style={styles.matchTitle}>{matchHeaderText(event as any)}</Text>
                        </Text>
                        <Text style={styles.matchSubtitle}>{event.tab + "\t\t" + event.tournamentName}</Text>
                    </View>
                    <Text style={styles.matchTime}>{formatDate(event.timestamp)}</Text>
                </Card>
            </TouchableOpacity>)}
        {[].map((match: Match) => (
            <TouchableOpacity key={match.matchId} onPress={() => handleMatchRouting(match.matchId)}>
                <Card style={styles.matchCard}>
                    <View style={styles.matchInfo}>
                        <Text style={styles.matchTitle}>
                            <Text style={styles.matchTitle}>{matchHeaderText(match)}</Text>
                        </Text>
                        <Text style={styles.matchSubtitle}>{(match.tab) + "\t\t" + match.tournament || 'Tournament Info'}</Text>
                    </View>
                    <Text style={styles.matchTime}>{formatDate(match.dateTimeUTC)}</Text>
                </Card>
            </TouchableOpacity>
        ))}
    </View>;
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    matchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
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
    matchTime: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#555',
    },
    matchSubtitle: {
        fontSize: 12,
        color: '#777',
    },
});