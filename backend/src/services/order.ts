import { Knex } from 'knex';
import { OrderDiscountRow, OrderItemRow } from '../database/rows';
import { toOrder, toOrderDiscount } from '../mappers/order';
import {
    OrderProductsNotFound,
    OrderProductNotEnoughStock,
    OrderNotFound,
    OrderCannotBeCancelled,
    OrderCouponsInvalid,
    OrderCannotBeCompleted,
} from '../errors/order';
import {
    OrderStatus,
    Order,
    OrderItem,
    Product,
    CheckoutItem,
    OrderDiscount,
} from 'shared';
import ProductService from './product';
import AddressService from './address';
import CouponService from './coupon';

/**
 * Service for managing orders.
 */
export default class OrderService {
    /**
     * Creates an instance of OrderService.
     * @param productService - ProductService instance.
     * @param addressService - AddressService instance.
     * @param couponService - CouponService instance.
     * @param db - Knex instance.
     * @returns OrderService instance.
     */
    public constructor(
        private readonly productService: ProductService,
        private readonly addressService: AddressService,
        private readonly couponService: CouponService,
        private readonly db: Knex,
    ) {}

    /**
     * Check if user has purchased product.
     * @param userId - User id.
     * @param productId - Product id.
     * @returns True if user has purchased product, false otherwise.
     */
    public async hasUserPurchasedProduct(
        userId: number,
        productId: number,
    ): Promise<boolean> {
        const row = await this.db('orders')
            .leftJoin('order_items', 'orders.id', 'order_items.order')
            .where('orders.user', userId)
            .andWhere('order_items.product', productId)
            .andWhere('orders.status', '<>', 'CANCELLED')
            .first();

        return !!row;
    }

    /**
     * Complete order.
     * @param orderId - Order id.
     * @throws OrderCannotBeCompleted if order cannot be completed.
     */
    public async completeOrder(orderId: number): Promise<void> {
        const order = await this.getOrder(orderId);

        if (order.status !== OrderStatus.PENDING) {
            throw new OrderCannotBeCompleted();
        }

        await this.db('orders').where('id', orderId).update({
            status: OrderStatus.COMPLETED,
        });
    }

    /**
     * Cancel order.
     * @param orderId - Order id.
     * @param userId - User id.
     * @throws OrderCannotBeCancelled if order cannot be cancelled.
     */
    public async cancelOrder(orderId: number, userId: number): Promise<void> {
        const order = await this.getOrder(orderId, userId);

        if (order.status !== OrderStatus.PENDING) {
            throw new OrderCannotBeCancelled();
        }

        const items = await this.getOrderItems(orderId, userId, false);

        await this.db.transaction(async (tx) => {
            await this.incrementStockAmount(
                tx,
                items.map((item) => ({
                    product: item.product.id,
                    quantity: item.quantity,
                    order: orderId,
                    price: item.product.price,
                })),
            );

            for (const item of items) {
                await tx('ratings')
                    .where('product', '=', item.product.id)
                    .andWhere('user', '=', userId)
                    .update({
                        verified: false,
                    });
            }

            await tx('orders')
                .where('id', orderId)
                .andWhere('user', userId)
                .update({
                    status: OrderStatus.CANCELLED,
                });
        });
    }

    /**
     * Get order.
     * @param orderId - Order id.
     * @param userId - User id.
     * @returns Order.
     * @throws OrderNotFound if order is not found.
     */
    public async getOrder(orderId: number, userId?: number): Promise<Order> {
        const row = await this.db('orders')
            .where('orders.id', orderId)
            .modify((query) => {
                if (userId) {
                    query.andWhere('orders.user', userId);
                }
            })
            .first();

        if (!row) {
            throw new OrderNotFound(orderId);
        }

        return toOrder(row);
    }

    /**
     * Get order items.
     * @param orderId - Order id.
     * @param userId - User id.
     * @returns Array of order items.
     * @throws OrderProductsNotFound if products are not found.
     */
    public async getOrderItems(
        orderId: number,
        userId: number,
        showDeleted: boolean,
    ): Promise<OrderItem[]> {
        const rows = await this.db('orders')
            .leftJoin('order_items', 'orders.id', 'order_items.order')
            .select<OrderItemRow[]>('order_items.*')
            .where('orders.id', orderId)
            .andWhere('orders.user', userId);

        const products = await this.productService.getProductsByIds(
            rows.map((row) => row.product),
            showDeleted,
        );

        return rows.map((row) => {
            const product = products.find(
                (product) => product.id === row.product,
            );

            if (!product) {
                throw new OrderProductsNotFound();
            }

            return {
                product,
                quantity: row.quantity,
            };
        });
    }

    /**
     * Get order discounts.
     * @param orderId - Order id.
     * @param userId - User id.
     * @returns Array of order discounts.
     */
    public async getOrderDiscounts(
        orderId: number,
        userId: number,
    ): Promise<OrderDiscount[]> {
        const rows = await this.db('order_discounts')
            .select<OrderDiscountRow[]>('order_discounts.*')
            .leftJoin('orders', 'order_discounts.order', 'orders.id')
            .where('order', orderId)
            .andWhere('orders.user', userId);
        return rows.map(toOrderDiscount);
    }

    /**
     * Get orders.
     * @param userId - User id.
     * @returns Array of orders.
     */
    public async getOrders(userId?: number): Promise<Order[]> {
        const rows = await this.db('orders').modify((query) => {
            if (userId) {
                query.where('user', userId);
            }
        });

        return rows.map(toOrder);
    }

    /**
     * Create order.
     * @param userId - User id.
     * @param addressId - Address id.
     * @param items - Array of checkout items.
     * @param couponCodes - Array of coupon codes.
     * @returns Order.
     * @throws OrderProductsNotFound if products are not found.
     * @throws OrderProductNotEnoughStock if product has not enough stock.
     * @throws OrderCouponsInvalid if coupons are invalid.
     */
    public async createOrder(
        userId: number,
        addressId: number,
        items: CheckoutItem[],
        couponCodes?: string[],
    ): Promise<Order> {
        const orderProducts = await this.prepareOrderItems(items);
        const address = await this.addressService.getAddressById(
            addressId,
            userId,
        );
        const total = this.calculateOrderTotal(orderProducts);

        const coupons = await Promise.all(
            couponCodes?.map(async (code) => {
                const coupon = await this.couponService.checkCoupon(
                    code,
                    total,
                );

                if (!coupon.valid) {
                    throw new OrderCouponsInvalid();
                }

                return coupon;
            }) || [],
        );

        const totalAfterDiscount = coupons.reduce(
            (acc, coupon) => acc - (coupon.discount || 0),
            total,
        );

        return await this.db.transaction(async (tx): Promise<Order> => {
            const [id] = await tx('orders').insert({
                user: userId,
                total: totalAfterDiscount,
                status: OrderStatus.PENDING,
                timestamp: Date.now(),
                first_name: address.firstName,
                name: address.name,
                city: address.city,
                country: address.country,
                street: address.street,
                zip: address.zip,
                company: address.company,
            });

            const orderItems = orderProducts.map(([item, product]) => ({
                order: id,
                product: item.product,
                quantity: item.quantity,
                price: product.price,
            }));

            await tx('order_items').insert(orderItems);
            await this.decrementStockAmount(tx, orderItems);

            if (coupons.length > 0) {
                await tx('order_discounts').insert(
                    coupons.map((coupon) => ({
                        order: id,
                        discount: coupon.discount || 0,
                    })),
                );
            }

            return {
                id,
                user: userId,
                status: OrderStatus.PENDING,
                total,
                timestamp: Date.now(),
                city: address.city,
                country: address.country,
                street: address.street,
                zip: address.zip,
                company: address.company,
                firstName: address.firstName,
                name: address.name,
            };
        });
    }

    /**
     * Decrement stock amount.
     *
     * @param tx - Knex transaction.
     * @param itemRows - Array of order item rows.
     */
    private async decrementStockAmount(
        tx: Knex.Transaction,
        itemRows: Omit<OrderItemRow, 'id'>[],
    ) {
        for (const item of itemRows) {
            await tx('products')
                .where('id', item.product)
                .decrement('stock_amount', item.quantity);
        }
    }

    /**
     * Increment stock amount.
     *
     * @param tx - Knex transaction.
     * @param itemRows - Array of order item rows.
     */
    private async incrementStockAmount(
        tx: Knex.Transaction,
        itemRows: Omit<OrderItemRow, 'id'>[],
    ) {
        for (const item of itemRows) {
            await tx('products')
                .where('id', item.product)
                .increment('stock_amount', item.quantity);
        }
    }

    /**
     * Calculate order total.
     *
     * @param items - Array of checkout items.
     * @returns Order total.
     */
    private calculateOrderTotal(items: [CheckoutItem, Product][]) {
        return items.reduce((acc, item) => {
            return acc + item[1].price * item[0].quantity;
        }, 0);
    }

    /**
     * Prepare order items by combining checkout items with products.
     * Also checks if products are found and have enough stock.
     *
     * @param items - Array of checkout items.
     * @returns Array of order items.
     * @throws OrderProductsNotFound if products are not found.
     * @throws OrderProductNotEnoughStock if product has not enough stock.
     */
    private async prepareOrderItems(
        items: CheckoutItem[],
    ): Promise<[CheckoutItem, Product][]> {
        const products = await this.productService.getProductsByIds(
            items.map((item) => item.product),
        );

        if (products.length !== items.length) {
            throw new OrderProductsNotFound();
        }

        return items.map((item) => {
            const product = products.find(
                (product) => product.id === item.product,
            );

            if (!product) {
                throw new Error(`Product ${item.product} for order not found`);
            }

            if (product.stockAmount < item.quantity) {
                throw new OrderProductNotEnoughStock(product.id);
            }

            return [item, product];
        });
    }
}
