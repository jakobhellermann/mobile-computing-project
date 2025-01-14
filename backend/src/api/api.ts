import { FastifyPluginAsync } from 'fastify';
import fastifyAuth from '@fastify/auth';
import { login } from './routes/auth/login';
import { register } from './routes/auth/register';
import { getProduct } from './routes/product/getProduct';
import { searchProducts } from './routes/product/searchProducts';
import ProductService from '../services/product';
import AuthService from '../services/auth';
import { getUser } from './routes/user/getUser';
import { searchUsers } from './routes/user/searchUsers';
import { deleteUser } from './routes/user/deleteUser';
import { createProduct } from './routes/product/createProduct';
import { updateProduct } from './routes/product/updateProduct';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { rateProduct } from './routes/product/rateProduct';
import RatingService from '../services/ratings';
import { getProductRatings } from './routes/product/getProductRatings';
import { authPlugin } from './plugins/auth';
import SessionService from '../services/session';
import UserService from '../services/user';
import { getCurrentUser } from './routes/user/getCurrentUser';
import { isAdminPlugin } from './plugins/admin';
import OrderService from '../services/order';
import { createOrder } from './routes/order/createOrder';
import { getOrders } from './routes/order/getOrders';
import { getOrder } from './routes/order/getOrder';
import { getOrderItems } from './routes/order/getOrderItems';
import { cancelOrder } from './routes/order/cancelOrder';
import { logout } from './routes/auth/logout';
import { deleteRating } from './routes/rating/deleteRating';
import { updateRating } from './routes/rating/updateRating';
import { getCurrentUserRatings } from './routes/user/getCurrentUserRatings';
import { updateCurrentUser } from './routes/user/updateCurrentUser';
import { updatePassword } from './routes/user/updatePassword';
import { getTopCategories } from './routes/product/getTopCategories';
import { getLatestRatings } from './routes/rating/getLatestRatings';
import AddressService from '../services/address';
import { getAddresses } from './routes/address/getAddresses';
import { createAddress } from './routes/address/createAddress';
import { updateAddress } from './routes/address/updateAddress';
import { deleteAddress } from './routes/address/deleteUser';
import CouponService from '../services/coupon';
import { createCoupon } from './routes/coupon/createCoupon';
import { checkCoupon } from './routes/coupon/checkCoupon';
import { getOrderDiscounts } from './routes/order/getOrderDiscounts';
import { deleteCoupon } from './routes/coupon/deleteCoupon';
import { getCoupons } from './routes/coupon/getCoupons';
import { updateCoupon } from './routes/coupon/updateCoupon';
import { deleteProduct } from './routes/product/deleteProduct';
import { getCoupon } from './routes/coupon/getCoupon';
import { getOrdersPerMonthStats } from './routes/stats/getOrdersPerMonthStats';
import StatsService from '../services/stats';
import { getOverviewStats } from './routes/stats/getOverviewStats';
import { getAllOrders } from './routes/order/getAllOrders';
import { cancelOrderForUser } from './routes/order/cancelOrderForUser';
import { completeOrder } from './routes/order/completeOrder';
import { getSubscriptions } from './routes/subscription/getSubscriptions';
import SubscriptionService from '../services/subscription';
import { createSubscription } from './routes/subscription/createSubscription';

/**
 * Creates the API routes.
 *
 * @param authService - Auth service.
 * @param productService - Product service.
 * @param ratingService - Rating service.
 * @param sessionService - Session service.
 * @param userService - User service.
 * @param orderService - Order service.
 * @param addressService - Address service.
 * @param couponService - Coupon service.
 * @param statsService - Stats service.
 * @returns Fastify plugin.
 */
export function api(
    authService: AuthService,
    productService: ProductService,
    ratingService: RatingService,
    subscriptionService: SubscriptionService,
    sessionService: SessionService,
    userService: UserService,
    orderService: OrderService,
    addressService: AddressService,
    couponService: CouponService,
    statsService: StatsService,
): FastifyPluginAsync {
    return async (fastify) => {
        await fastify.register(fastifyAuth);
        await fastify.register(authPlugin(sessionService));
        await fastify.register(isAdminPlugin(userService));

        await fastify.register(fastifySwagger, {
            openapi: {
                openapi: '3.0.0',
                info: {
                    title: 'Shop',
                    description: 'Shop REST API documentation',
                    version: '1.0.0',
                },
            },
        });

        await fastify.register(fastifySwaggerUI, {
            routePrefix: '/docs',
        });

        await fastify.register(login(authService));
        await fastify.register(register(authService));
        await fastify.register(logout(sessionService));

        await fastify.register(updatePassword(authService));
        await fastify.register(getCurrentUser(userService));
        await fastify.register(updateCurrentUser(userService));
        await fastify.register(getUser(userService));
        await fastify.register(searchUsers(userService));
        await fastify.register(deleteUser(userService));

        await fastify.register(getAddresses(addressService));
        await fastify.register(createAddress(addressService));
        await fastify.register(updateAddress(addressService));
        await fastify.register(deleteAddress(addressService));

        await fastify.register(getProduct(productService));
        await fastify.register(searchProducts(productService));
        await fastify.register(createProduct(productService));
        await fastify.register(updateProduct(productService));
        await fastify.register(deleteProduct(productService));

        await fastify.register(getTopCategories(productService));

        await fastify.register(rateProduct(ratingService));
        await fastify.register(getProductRatings(ratingService));
        await fastify.register(updateRating(ratingService));
        await fastify.register(deleteRating(ratingService));
        await fastify.register(getCurrentUserRatings(ratingService));
        await fastify.register(getLatestRatings(ratingService));


        await fastify.register(getSubscriptions(subscriptionService));
        await fastify.register(createSubscription(subscriptionService));

        await fastify.register(createOrder(orderService));
        await fastify.register(getOrders(orderService));
        await fastify.register(getAllOrders(orderService));
        await fastify.register(getOrder(orderService));
        await fastify.register(getOrderItems(orderService));
        await fastify.register(getOrderDiscounts(orderService));
        await fastify.register(cancelOrder(orderService));
        await fastify.register(cancelOrderForUser(orderService));
        await fastify.register(completeOrder(orderService));

        await fastify.register(getCoupons(couponService));
        await fastify.register(getCoupon(couponService));
        await fastify.register(createCoupon(couponService));
        await fastify.register(checkCoupon(couponService));
        await fastify.register(deleteCoupon(couponService));
        await fastify.register(updateCoupon(couponService));

        await fastify.register(getOrdersPerMonthStats(statsService));
        await fastify.register(getOverviewStats(statsService));
    };
}
