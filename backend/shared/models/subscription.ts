
export type SubscriptionType = "tournament" | "match" | "team";

export type Subscription = {
  type: SubscriptionType;
  name: string;

  notifications: boolean;
  timestamp: number;
};