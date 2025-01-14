import * as Notifications from "expo-notifications";
import { Notification, NotificationChannel } from "expo-notifications";
import Constants from 'expo-constants';
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { useEffect, useRef, useState } from 'react';
import { Platform } from "react-native";
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    })
});

export function usePushNotifications(
    { onNotificationResponse }: { onNotificationResponse: (response: Notifications.NotificationResponse) => void; }
): { expoPushToken: string; lastNotification: Notification | undefined; } {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState<NotificationChannel[]>([]);
    const [lastNotification, setNotification] = useState<Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            token && setExpoPushToken(token);
        });

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("got notification: ");
            console.log(notification);
            setNotification(notification);
        });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return { expoPushToken, lastNotification };
}


async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here', test: { test1: 'more data' } },
        },
        trigger: {
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 2,
        },
    });
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice && Platform.OS != "web") {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const token = await Notifications.getExpoPushTokenAsync({
                projectId,
            });
            return token.data;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        // handleRegistrationError('Must use physical device for push notifications');
    }
}

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}