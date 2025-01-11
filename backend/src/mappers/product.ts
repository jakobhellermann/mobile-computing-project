import { Product } from 'shared';
import {
    ProductImageRow,
    ProductRatingRow,
    ProductRow,
} from '../database/rows';

/**
 * Convert product row to product.
 * @param row - Product row.
 * @param imageRows - Product image rows of the product.
 * @param rating - Product rating row of the product.
 * @returns Product.
 */
export function toProduct(
    row: ProductRow,
    imageRows: ProductImageRow[],
    rating?: ProductRatingRow,
): Product {
    return {
        id: row.id,
        productName: row.product_name,
        description: row.description,
        price: row.price,
        stockAmount: row.stock_amount,
        images: imageRows.map((imageRow) => imageRow.image_url),
        totalRatings: rating?.total_ratings,
        rating: rating?.rating,
        category: row.category,
    };
}

/**
 * Convert product rows to products.
 * @param rows - Product rows.
 * @param ratings - Product rating rows of all products.
 * @param imageRows - Product image rows of all products.
 * @returns Products.
 */
export function toProducts(
    rows: ProductRow[],
    ratings: ProductRatingRow[],
    imageRows: ProductImageRow[],
): Product[] {
    return rows.map((row) => {
        const images = imageRows.filter(
            (imageRow) => imageRow.product === row.id,
        );
        const rating = ratings.find((r) => r.product === row.id);

        return toProduct(row, images, rating);
    });
}
