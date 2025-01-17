import SubscriptionService from "../services/subscription";
import { cargoQuery } from "../services/leaguepedia";
import UpcomingEventService from "../services/upcomingEvent";

export async function runUpdateMatches(subscriptionService: SubscriptionService, upcomingEventService: UpcomingEventService): Promise<void> {
    let all = await subscriptionService.getAllSubscriptions();
    let byType = groupBy(all, x => x.type);
    let tournaments = byType.tournament ?? [];


    let tournamentIds = [...new Set(tournaments.map(x => x.name))];

    console.log(`Updating matches for ${tournaments.map(x => x.name).join(", ")}`);

    let tournamentFilter = tournamentIds.map(x => `OverviewPage = "${x}"`).join(" OR ");

    let upcomingMatches = await cargoQuery<any>({
        tables: 'MatchSchedule',
        fields: 'MatchId, Tab, Team1, Team2, Winner, Team1Score, Team2Score, MatchDay, DateTime_UTC, OverviewPage',
        where: `${tournamentFilter} AND Winner IS NULL`,
        limit: 50,
        order_by: 'DateTime_UTC asc',
    });
    console.log(upcomingMatches);
    let updates = upcomingMatches.map(match => ({
        matchId: match["MatchId"],
        tournament: match["OverviewPage"],
        team1: match["Team1"],
        team2: match["Team2"],
        timestamp: new Date(match["DateTime UTC"] + 'Z'),
    }));

    await upcomingEventService.bulkUpsertUpcomingEvent(updates);
    let fetched = await upcomingEventService.getAll();
    console.log(fetched);

}

function groupBy<T, K extends keyof any>(arr: T[], callback: (item: T, index: number, all: T[]) => K): Partial<Record<K, T[]>> {
    return arr.reduce<Partial<Record<K, T[]>>>((acc = {}, ...args) => {
        const key = callback(...args);
        acc[key] ??= [];
        acc[key].push(args[0]);
        return acc;
    }, {});
};