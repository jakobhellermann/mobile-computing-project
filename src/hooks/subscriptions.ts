import { Subscription } from "@/backend/shared";
import useSWR, { mutate, SWRResponse } from "swr";
import { apiFetch } from "../api/base";

type SubscriptionType = string;

type HookResponse = SWRResponse<Subscription[], Error> & {
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
        ...swr
    };
}