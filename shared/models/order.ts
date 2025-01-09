import { Product } from "./product";

export type CheckoutItem = {
  product: number;
  quantity: number;
};

export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export type OrderItem = {
  product: Product;
  quantity: number;
};

export type OrderDiscount = {
  discount: number;
};

export type Order = {
  id: number;
  user: number;
  status: OrderStatus;
  total: number;
  timestamp: number;
  name: string;
  firstName: string;
  company?: string;
  street: string;
  city: string;
  zip: string;
  country: string;
};
