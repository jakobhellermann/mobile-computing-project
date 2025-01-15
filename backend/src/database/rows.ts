import { Knex } from 'knex';

/**
 * User row in the database.
 */
export type UserRow = {
    id: number;
    email: string;
    password_hash: string;
    is_admin: number;
};

/**
 * Subscription row in the database.
 */
export type SubscriptionRow = {
    id: number;
    user: number;
    name: string;
    type: string;
    notifications: boolean;
    timestamp: number;
};

/**
 * Address row in the database.
 */
export type AddressRow = {
    id: number;
    user: number;
    name: string;
    first_name: string;
    company?: string;
    street: string;
    city: string;
    zip: string;
    country: string;
};

/**
 * Session row in the database.
 */
export type SessionRow = {
    id: number;
    user: number;
    token_hash: string;
    user_agent: string;
    last_used_at: number;
    created_at: number;
};

/**
 * Product row in the database.
 */
export type ProductRow = {
    id: number;
    product_name: string;
    description: string;
    price: number;
    stock_amount: number;
    category: string;
    deleted: boolean;
};

/**
 * Product row with image url.
 * A product can have multiple images.
 */
export type ProductImageRow = {
    id: number;
    product: number;
    image_url: string;
};

/**
 * Product row with rating.
 * A product can have multiple ratings.
 */
export type ProductRatingRow = {
    product: number;
    rating: number;
    total_ratings: number;
};

/**
 * Rating row in the database.
 */
export type RatingRow = {
    id: number;
    user: number;
    product: number;
    verified: boolean;
    comment?: string;
    title?: string;
    rating: number;
    timestamp: number;
};

/**
 * Coupon row in the database.
 */
export type CouponRow = {
    id: number;
    code: string;
    discount: number;
    discount_type: string;
    valid_until: number;
    min_order_value?: number;
};

/**
 * Order row in the database.
 */
export type OrderRow = {
    id: number;
    user: number;
    status: string;
    total: number;
    timestamp: number;
    name: string;
    first_name: string;
    company?: string;
    street: string;
    city: string;
    zip: string;
    country: string;
};

/**
 * Order item row in the database.
 */
export type OrderItemRow = {
    id: number;
    order: number;
    product: number;
    quantity: number;
    price: number;
};

/**
 * Order discount row in the database.
 */
export type OrderDiscountRow = {
    order: number;
    discount: number;
};

// Define the types for knex.
declare module 'knex/types/tables' {
    /**
     * Tables in the database.
     * The keys are table names and the values are the table types.
     */
    interface Tables {
        users: Knex.CompositeTableType<UserRow, Omit<UserRow, 'id'>>;
        addresses: Knex.CompositeTableType<AddressRow, Omit<AddressRow, 'id'>>;
        sessions: Knex.CompositeTableType<SessionRow, Omit<SessionRow, 'id'>>;
        products: Knex.CompositeTableType<ProductRow, Omit<ProductRow, 'id'>>;
        product_images: Knex.CompositeTableType<
            ProductImageRow,
            Omit<ProductImageRow, 'id'>
        >;
        ratings: Knex.CompositeTableType<RatingRow, Omit<RatingRow, 'id'>>;
        coupons: Knex.CompositeTableType<CouponRow, Omit<CouponRow, 'id'>>;
        orders: Knex.CompositeTableType<OrderRow, Omit<OrderRow, 'id'>>;
        order_items: Knex.CompositeTableType<
            OrderItemRow,
            Omit<OrderItemRow, 'id'>
        >;
        order_discounts: Knex.CompositeTableType<
            OrderDiscountRow,
            Omit<OrderDiscountRow, 'id'>
        >;
    }
}

// Define the types for knex.
declare module 'knex/types/result' {
    interface Registry {
        Count: number;
    }
}
