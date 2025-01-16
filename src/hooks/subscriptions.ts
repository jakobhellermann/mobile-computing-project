import { Subscription } from "@/backend/shared";
import useSWR, { mutate, SWRResponse } from "swr";
import { apiFetch } from "../api/base";

type SubscriptionType = "tournament" | "team" | "match";


type HookResponse = {
    subscription: SWRResponse<Subscription, Error>,
    updateSubscription: (data?: { notifications: boolean; }) => Promise<void>;
    deleteSubscription: () => Promise<void>;

    toggleSubscription: () => Promise<void>;
    toggleNotifications: () => Promise<void>;
};

export function useAllSubscriptions(): SWRResponse<Subscription[], Error> {
    return useSWR<Subscription[], Error>("/subscription");
}

export function useSubscription(type: SubscriptionType, name: string): HookResponse {
    const resource = `/subscription/${type}/${encodeURIComponent(name)}`;
    const subscription = useSWR<Subscription, Error>(resource);


    const updateSubscription = async (data?: { notifications: boolean; }) => {
        let optimisticUpdate: Subscription = subscription.data ? { ...subscription.data, ...data } : {
            name, type, notifications: data?.notifications ?? false, timestamp: 0
        };
        subscription.mutate(optimisticUpdate, { revalidate: false });

        await apiFetch<void>(resource, {
            method: "PUT",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(data ?? {})
        });
        // revalidate
        mutate(resource);
    };
    const deleteSubscription = () => apiFetch<void>(resource, { method: "DELETE" }).finally(() => {
        mutate(resource, null);
    });



    const toggleSubscription = () => {
        if (subscription.data) {
            return deleteSubscription();
        } else {
            return updateSubscription();
        }
    };
    const toggleNotifications = () => {
        if (subscription.data) {
            return updateSubscription({ notifications: !subscription.data.notifications });
        }
        return Promise.resolve();
    };


    return {
        subscription,
        updateSubscription,
        deleteSubscription,

        toggleSubscription,
        toggleNotifications,
    };
}


/*

type HookResponse = {
    subscriptions: SWRResponse<Subscription[], Error>,
    createSubscription: (name: string, type: SubscriptionType) => Promise<void>;
};
export function useSubscriptions(): HookResponse {
    const swr = useSWR<Subscription[], Error>("/subscriptions");
    const createSubscription = (name: string, type: SubscriptionType) => {
        return apiFetch<void>("/subscriptions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, type })
        }).finally(() => {
            mutate("/subscriptions");
        });
    };

    return {
        createSubscription,
        subscriptions: swr,
    };
}*/