import { Order, OrderDiscount, OrderStatus } from 'shared';
import { OrderDiscountRow, OrderRow } from '../database/rows';

/**
 * Convert order row to order.
 * @param row - Order row.
 * @returns Order.
 */
export function toOrder(row: OrderRow): Order {
    return {
        id: row.id,
        user: row.user,
        status: row.status as OrderStatus,
        total: row.total,
        timestamp: row.timestamp,
        city: row.city,
        zip: row.zip,
        country: row.country,
        street: row.street,
        company: row.company,
        name: row.name,
        firstName: row.first_name,
    };
}

/**
 * Convert order discount row to order discount.
 * @param row - Order discount row.
 * @returns Order discount.
 */
export function toOrderDiscount(row: OrderDiscountRow): OrderDiscount {
    return {
        discount: row.discount,
    };
}
