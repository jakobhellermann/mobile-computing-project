export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

export type Coupon = {
  id: number;
  code: string;
  discount: number;
  discountType: DiscountType;
  validUntil: number;
  minOrderValue?: number;
};

export type CouponValidationReason =
  | "expired"
  | "not_found"
  | "min_order_value";

export type CouponValidationResult = {
  valid: boolean;
  discount?: number;
  reason?: CouponValidationReason;
  minOrderValue?: number;
};
