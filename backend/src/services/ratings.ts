import { Knex } from 'knex';
import ProductService from './product';
import { Rating, UserRating } from 'shared';
import {
    RatingNotFoundError,
    RatingUserAlreadyRatedError,
} from '../errors/rating';
import OrderService from './order';
import { toRating, toUserRatings } from '../mappers/rating';

/**
 * Service for managing ratings.
 */
export default class RatingService {
    /**
     * Creates an instance of RatingService.
     * @param db - Knex instance.
     * @param productService - ProductService instance.
     * @param orderService - OrderService instance.
     * @returns RatingService instance.
     */
    public constructor(
        private readonly db: Knex,
        private readonly productService: ProductService,
        private readonly orderService: OrderService,
    ) {}

    /**
     * Update rating.
     * @param ratingId - Rating id.
     * @param userId - User id.
     * @param rating - Rating.
     * @param comment - Comment.
     * @param title - Title.
     * @throws RatingNotFoundError if rating is not found.
     */
    public async updateRating(
        ratingId: number,
        userId: number,
        rating: number,
        comment?: string,
        title?: string,
    ): Promise<void> {
        const currentRating = await this.getRatingById(ratingId, userId);
        const verified = await this.orderService.hasUserPurchasedProduct(
            userId,
            currentRating.product,
        );

        const rowsAffected = await this.db('ratings')
            .where({ id: ratingId, user: userId })
            .update({
                rating,
                comment,
                title,
                verified,
            });

        if (rowsAffected === 0) {
            throw new RatingNotFoundError();
        }
    }

    /**
     * Create rating.
     * @param userId - User id.
     * @param productId - Product id.
     * @param rating - Rating.
     * @param comment - Comment.
     * @param title - Title.
     * @throws RatingUserAlreadyRatedError if user has already rated the product.
     */
    public async createRating(
        userId: number,
        productId: number,
        rating: number,
        comment?: string,
        title?: string,
    ): Promise<void> {
        const product = await this.productService.getProductById(productId);

        if (await this.hasUserAlreadyRatedProduct(userId, product.id)) {
            throw new RatingUserAlreadyRatedError();
        }

        const verified = await this.orderService.hasUserPurchasedProduct(
            userId,
            product.id,
        );

        await this.db('ratings').insert({
            user: userId,
            product: product.id,
            rating,
            verified,
            comment,
            title,
            timestamp: Date.now(),
        });
    }

    /**
     * Get ratings by product id.
     * @param productId - Product id.
     * @returns Array of ratings.
     */
    public async getRatingsByProductId(productId: number): Promise<Rating[]> {
        const product = await this.productService.getProductById(productId);

        const row = await this.db('ratings')
            .where({ product: product.id })
            .select();

        return row.map(toRating);
    }

    /**
     * Get ratings by user id.
     * @param userId - User id.
     * @returns Array of ratings.
     */
    public async getRatingsByUserId(userId: number): Promise<UserRating[]> {
        const row = await this.db('ratings').where({ user: userId }).select();

        const products = await this.productService.getProductsByIds(
            row.map((rating) => rating.product),
        );

        return toUserRatings(row, products);
    }

    /**
     * Delete rating.
     * @param ratingId - Rating id.
     * @param userId - User id.
     * @throws RatingNotFoundError if rating is not found.
     */
    public async deleteRating(ratingId: number, userId: number): Promise<void> {
        const rowsAffected = await this.db('ratings')
            .where({ id: ratingId, user: userId })
            .delete();
        if (rowsAffected === 0) {
            throw new RatingNotFoundError();
        }
    }

    /**
     * Get latest ratings.
     * @returns Array of ratings.
     */
    public async getLatestRatings(): Promise<UserRating[]> {
        const rows = await this.db('ratings')
            .orderBy('timestamp', 'desc')
            .whereNotNull('title')
            .limit(10)
            .select();

        const ids = rows
            .filter((rating) => rating.title)
            .map((rating) => rating.product);

        if (ids.length === 0) {
            return [];
        }

        const products = await this.productService.getProductsByIds(ids);

        return toUserRatings(rows, products);
    }

    /**
     * Check if user has already rated a product.
     * @param userId - User id.
     * @param productId - Product id.
     * @returns True if user has already rated the product.
     * @returns False if user has not rated the product.
     */
    private async hasUserAlreadyRatedProduct(
        userId: number,
        productId: number,
    ): Promise<boolean> {
        const product = await this.productService.getProductById(productId);

        const row = await this.db('ratings')
            .where({ user: userId, product: product.id })
            .select();

        return row.length > 0;
    }

    /**
     * Get rating by id.
     * @param id - Rating id.
     * @param userId - User id.
     * @returns Rating.
     * @throws RatingNotFoundError if rating is not found.
     */
    private async getRatingById(id: number, userId: number) {
        const row = await this.db('ratings')
            .where({ id, user: userId })
            .select()
            .first();

        if (!row) {
            throw new RatingNotFoundError();
        }

        return toRating(row);
    }
}
