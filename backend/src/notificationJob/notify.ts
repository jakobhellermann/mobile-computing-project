import SubscriptionService from "../services/subscription";
import UpcomingEventService from "../services/upcomingEvent";
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

let expo = new Expo({
    accessToken: "QOTD4i2lz5xiKsbXljypMCNYMYJPJU3np89sI5rY"
});

export async function runNotify(subscriptionService: SubscriptionService, upcomingEventsService: UpcomingEventService) {
    console.log("Checking for notifications...");

    let now = new Date();
    // For testing: fake being in the f uture
    // now.setDate(now.getDate() + 2);

    let newlyHappened = await upcomingEventsService.getAll({ beforeDate: now, onlyUnnotified: true });
    let notifications: ExpoPushMessage[] = [];

    for (const event of newlyHappened) {
        let subscriptionsToEvent = await subscriptionService.getSubscribedUsers({
            match: event.matchId,
            teams: [event.team1, event.team2],
            tournament: event.tournament,
        }, true);

        let pushTokens = subscriptionsToEvent
            .filter(entry => {
                if (!entry.pushToken) {
                    console.warn(`WARNING: User ${entry.user} has no push token but wants to be notified!`);
                    return false;
                }
                return true;
            })
            .map(x => x.pushToken) as string[];

        notifications.push({
            to: pushTokens,
            sound: 'default',
            title: `${event.tournamentName}`,
            subtitle: 'subtitle',
            body: `Now starting: ${event.team1} vs ${event.team2}`,
            data: {
                match: event.matchId,
            }
        });
    }

    await upcomingEventsService.markNotified(newlyHappened);

    if (notifications.length > 0) {
        console.log("Sending notifications", notifications);
        await sendNotifications(notifications);
    }
}

async function sendNotifications(messages: ExpoPushMessage[]) {
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
    }
}