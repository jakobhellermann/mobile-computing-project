import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAllSubscriptions, useSubscription } from '@/src/hooks/subscriptions';
import { SubscriptionType } from 'shared';
import { IconButton } from '@/components/IconButton';
import { useNotifications } from '@/src/hooks/toast';
import { useAuth } from '@/src/modules/auth/context';

let subscriptionName: Record<SubscriptionType, string> = {
    tournament: "Tournament",
    team: "Team",
    match: "Match",
};
let allSubscriptionTypes: SubscriptionType[] = ["tournament", "team", "match"];

export default function SubscriptionsPage() {
    const subscriptions = useAllSubscriptions();

    if (!subscriptions.data) return;

    let grouped = groupBy(subscriptions.data, x => x.type);

    return <View style={styles.container}>
        {allSubscriptionTypes
            .map(type => {
                let typeSubscriptions = grouped[type] ?? [];
                return <View key={type}>
                    <ThemedText type='subtitle'>{subscriptionName[type as SubscriptionType]}</ThemedText>
                    {typeSubscriptions.length === 0 && <ThemedText>No subscriptions</ThemedText>}
                    <View style={subStyles.containerInner}>
                        {typeSubscriptions.map(subscription => {

                            return <View key={subscription.name} style={subStyles.container}>
                                <ThemedText style={{ flexShrink: 1 }}>{subscription.name.replaceAll(/[_\/]/g, " ")}</ThemedText>

                                <SubscriptionConfigIcons type={subscription.type} name={subscription.name} />
                            </View>;

                        })}
                    </View>
                </View>;
            })
        }
    </View>;
}

export function SubscriptionConfigIcons({ type, name }: { type: SubscriptionType, name: string; }) {
    const { subscription, toggleSubscription, toggleNotifications } = useSubscription(type, name);
    const { showError } = useNotifications();

    const { user } = useAuth();
    const router = useRouter();
    let loggedIn = user !== null;

    const navigateToProfile = () => {
        router.push("/(tabs)/profile");
    };

    return <View style={subStyles.icons}>
        <IconButton
            name='star' size={24}
            color={subscription.data ? "gold" : "black"}
            onPress={() => {
                if (!loggedIn) return navigateToProfile();
                return toggleSubscription().catch(showError);
            }}
        />
        <IconButton
            disabled={!subscription.data}
            name='notifications-on' size={24}
            color={subscription.data?.notifications ? "gold" : "black"}
            onPress={() => {
                if (!loggedIn) return navigateToProfile();
                return toggleNotifications().catch(showError);
            }}
        />
    </View>;

}

const subStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerInner: {
        gap: 8,
    },
    icons: {
        flexDirection: 'row',
        gap: 16,
    }
});

function groupBy<T, K extends keyof any>(arr: T[], callback: (item: T, index: number, all: T[]) => K): Partial<Record<K, T[]>> {
    return arr.reduce<Partial<Record<K, T[]>>>((acc = {}, ...args) => {
        const key = callback(...args);
        acc[key] ??= [];
        acc[key].push(args[0]);
        return acc;
    }, {});
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#ffffff",
        padding: 8,
        borderWidth: 1,
        borderColor: "#cecece",
        borderRadius: 4,
    },
    container: {
        padding: 16,
        gap: 8,
    },
});
