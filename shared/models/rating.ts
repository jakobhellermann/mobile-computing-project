import { Product } from "./product";

export type Rating = {
  id: number;
  user: number;
  product: number;
  verified: boolean;
  title?: string;
  comment?: string;
  rating: number;
  timestamp: number;
};

export type UserRating = {
  id: number;
  verified: boolean;
  title?: string;
  comment?: string;
  rating: number;
  timestamp: number;
  product: Product;
};
