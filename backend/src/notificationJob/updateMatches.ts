import SubscriptionService from "../services/subscription";
import { cargoQuery, getCurrentTime } from "../services/leaguepedia";
import UpcomingEventService from "../services/upcomingEvent";

function buildQueryIn(column: string, inList: string[]) {
    return `${column} in (${inList.map(x => `"${x.replaceAll('"', '\\"')}"`)})`;
}
function buildQueryOr(...subqueries: string[]) {
    return subqueries.join(" OR ");
}

export async function runUpdateMatches(subscriptionService: SubscriptionService, upcomingEventService: UpcomingEventService): Promise<void> {
    let all = await subscriptionService.getAllSubscriptions();
    let byType = groupBy(all, x => x.type);

    let tournamentIds = [...new Set((byType.tournament ?? []).map(x => x.name))];
    let matchIds = [...new Set((byType.match ?? []).map(x => x.name))];
    let teamIds = [...new Set((byType.team ?? []).map(x => x.name))];

    let queryInFuture = `M.DateTime_UTC > '${getCurrentTime()}'`;
    let subscriptionFilter = buildQueryOr(
        buildQueryIn("M.MatchId", matchIds),
        buildQueryIn("M.OverviewPage", tournamentIds),
        buildQueryIn("M.Team2", teamIds),
    );
    let where = `(${subscriptionFilter}) AND ${queryInFuture}`;
    let upcomingMatches = await cargoQuery<any>({
        // tables: 'MatchSchedule=M, Tournaments=T',
        // fields: 'MatchId, Tab, Team1, Team2, Winner, Team1Score, Team2Score, MatchDay, DateTime_UTC, OverviewPage',
        // join_on: "M.OverviewPage=T.OverviewPage",
        tables: 'MatchSchedule=M, Tournaments=T',
        fields: 'M.MatchId, M.Team1, M.Team2, M.Winner, M.Team1Score, M.Team2Score, M.MatchDay, M.DateTime_UTC, M.OverviewPage, M.Stream, T.Name=TournamentName',
        join_on: 'M.OverviewPage=T.OverviewPage',
        where,
        limit: 50,
        order_by: 'DateTime_UTC asc',
    });
    let updates = upcomingMatches.map(match => ({
        matchId: match["MatchId"],
        tournament: match["OverviewPage"],
        tournamentName: match["TournamentName"],
        team1: match["Team1"],
        team2: match["Team2"],
        timestamp: new Date(match["DateTime UTC"] + 'Z'),
    }));

    await upcomingEventService.bulkUpsertUpcomingEvent(updates);
    let fetched = await upcomingEventService.getAll();
    console.log(`Updated ${updates.length} entries in to upcomingEvents table; new length ${fetched.length}`);

}

function groupBy<T, K extends keyof any>(arr: T[], callback: (item: T, index: number, all: T[]) => K): Partial<Record<K, T[]>> {
    return arr.reduce<Partial<Record<K, T[]>>>((acc = {}, ...args) => {
        const key = callback(...args);
        acc[key] ??= [];
        acc[key].push(args[0]);
        return acc;
    }, {});
};