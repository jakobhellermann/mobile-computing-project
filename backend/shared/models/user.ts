export type User = {
  id: number;
  email: string;
  isAdmin: boolean;
};

export type UserUpdate = {
  email?: string;
};
