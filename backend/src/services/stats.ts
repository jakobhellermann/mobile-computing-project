import { Knex } from 'knex';
import { OrdersPerMonthStat, OverviewStats } from 'web-shop-shared';

/**
 * Service for managing stats.
 */
export default class StatsService {
    /**
     * Creates an instance of StatsService.
     * @param db - Knex instance.
     * @returns StatsService instance.
     */
    public constructor(private readonly db: Knex) {}

    /**
     * Get orders per month.
     * @param start - Start date.
     * @param end - End date.
     * @param limit - Limit.
     * @returns Array of orders per month.
     */
    public async getOrdersPerMonth({
        start,
        end,
        limit = 6,
    }: {
        start?: Date;
        end?: Date;
        limit?: number;
    } = {}) {
        const result: OrdersPerMonthStat[] = await this.db('orders')
            .count('id', { as: 'orders' })
            .select(
                this.db.raw(
                    "strftime('%m-%Y', datetime(timestamp / 1000, 'unixepoch')) as month",
                ),
            )
            .modify((query) => {
                if (start) {
                    query.where('timestamp', '>=', start.getTime());
                }
                if (end) {
                    query.where('timestamp', '<=', end.getTime());
                }
            })
            .where('status', '<>', 'CANCELLED')
            .groupBy('month')
            .orderBy('month', 'desc')
            .limit(limit);

        return result;
    }

    /**
     * Get overview stats.
     * @returns Overview stats.
     */
    public async getOverviewStats(): Promise<OverviewStats> {
        const products = await this.db('products')
            .sum('stock_amount', { as: 'total_stock' })
            .count('id', { as: 'count' })
            .first();

        const orders = await this.db('orders')
            .count('orders.id', { as: 'count' })
            .sum('orders.total', { as: 'total_revenue' })
            .where('orders.status', '<>', 'CANCELLED')
            .first();

        const orderItems = await this.db('order_items')
            .sum('quantity', { as: 'total_sold' })
            .first();

        return {
            totalOrders: orders?.count || 0,
            totalProducts: products?.count || 0,
            totalStock: products?.total_stock || 0,
            totalRevenue: orders?.total_revenue || 0,
            totalSold: orderItems?.total_sold || 0,
        };
    }
}
