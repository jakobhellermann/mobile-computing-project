export type User = {
  id: number;
  email: string;
  name: string;
  firstName: string;
  isAdmin: boolean;
};

export type UserUpdate = {
  email?: string;
  name?: string;
  firstName?: string;
};
