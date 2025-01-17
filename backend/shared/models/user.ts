export type User = {
  id: number;
  email: string;
  isAdmin: boolean;
  hasPushToken: boolean;
};

export type UserUpdate = {
  email?: string;
  pushToken?: string;
};
