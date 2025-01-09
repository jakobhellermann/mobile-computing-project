import { Product, Rating, UserRating } from 'web-shop-shared';
import { RatingRow } from '../database/rows';

/**
 * Convert rating row to rating.
 * @param row - Rating row.
 * @returns Rating.
 */
export function toRating(row: RatingRow): Rating {
    return {
        id: row.id,
        user: row.user,
        product: row.product,
        verified: row.verified,
        comment: row.comment,
        title: row.title,
        rating: row.rating,
        timestamp: row.timestamp,
    };
}

/**
 * Convert a rating row to a user rating.
 * @param row - Rating row.
 * @param product - Product.
 * @returns User rating.
 */
export function toUserRating(row: RatingRow, product: Product): UserRating {
    return {
        id: row.id,
        verified: row.verified,
        title: row.title,
        comment: row.comment,
        rating: row.rating,
        timestamp: row.timestamp,
        product,
    };
}

/**
 * Convert rating rows to user ratings.
 * @param rows - Rating rows.
 * @param products - Products.
 * @returns User ratings.
 */
export function toUserRatings(
    rows: RatingRow[],
    products: Product[],
): UserRating[] {
    return rows.map((row): UserRating => {
        const product = products.find((product) => product.id === row.product);

        if (!product) {
            throw new Error(
                `Product with id ${row.product} not found for rating with id ${row.id}`,
            );
        }

        return toUserRating(row, product);
    });
}
