import * as Notifications from "expo-notifications";
import { Notification } from "expo-notifications";
import Constants from 'expo-constants';
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
    { onNotificationResponse, onPushTokenSet }: {
        onNotificationResponse?: (response: Notifications.NotificationResponse) => void;
        onPushTokenSet?: (pushToken: string) => void;
    }
): { expoPushToken: string; lastNotification: Notification | undefined; } {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [lastNotification, setNotification] = useState<Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            console.log(`has push token ${token}`);
            token && onPushTokenSet?.(token);
            token && setExpoPushToken(token);
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("got notification: ");
            console.log(notification);
            setNotification(notification);
        });
        if (onNotificationResponse) responseListener.current = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [onNotificationResponse, onPushTokenSet]);

    return { expoPushToken, lastNotification };
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }


    if (Platform.OS === "web") {
        console.log("Not a real device!")
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return null;
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
        return null;
    }
}

function handleRegistrationError(errorMessage: string) {
    // Don't bubble this to the user
    console.error(errorMessage);
}