
export async function runNotify() {
    console.log("notify!");
}

/*import { Expo } from 'expo-server-sdk';

let expo = new Expo({
    accessToken: "QOTD4i2lz5xiKsbXljypMCNYMYJPJU3np89sI5rY"
});

let pushToken = "ExponentPushToken[-_fD_eAIY5DuvSHlCQtrc7]";



async function run() {

    let messages = [{
        to: pushToken,
        sound: 'default',
        body: 'This is a test notification',
        data: { withSome: 'data' },
    }];
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
        let tickets = await expo.sendPushNotificationsAsync(chunk);
        console.log(tickets);
    }

    // var admin = require("firebase-admin");
    // 
    // var serviceAccount = require("mobile-computing-project-google-serviceaccount.json");
    // 
    // admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount)
    // });

}

run().catch(console.error);*/