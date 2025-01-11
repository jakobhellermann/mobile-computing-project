import { Knex } from 'knex';
import { ProductRatingRow } from '../database/rows';
import { toProduct, toProducts } from '../mappers/product';
import { ProductNotFoundError } from '../errors/product';
import { Product, Page, PageRequest, Category } from 'shared';

/**
 * Service for managing products.
 */
export default class ProductService {
    /**
     * Creates an instance of ProductService.
     * @param db - Knex instance.
     * @returns ProductService instance.
     */
    public constructor(private readonly db: Knex) {}

    /**
     * Get top categories.
     * Based on the number of products in the category.
     *
     * @returns Array of categories.
     */
    public async getTopCategories(): Promise<Category[]> {
        const res = await this.db('products')
            .countDistinct('products.id', { as: 'count' })
            .sumDistinct('products.stock_amount', { as: 'total_stock' })
            .where('deleted', '=', false)
            .select('category', 'image_url')
            .groupBy('category')
            .leftJoin('product_images', 'products.id', 'product_images.product')
            .orderBy('count', 'desc');

        return res.map((row) => ({
            count: row.count,
            totalStock: row.total_stock,
            name: row.category,
            imageUrl: row.image_url,
        }));
    }

    /**
     * Create a product.
     * @param product - Product to create.
     * @returns Product id.
     */
    public async createProduct({
        productName,
        description,
        price,
        stockAmount,
        images,
        category,
    }: Omit<Product, 'id'>): Promise<number> {
        return await this.db.transaction(async (tx) => {
            const [id] = await tx('products').insert({
                product_name: productName,
                description,
                price,
                stock_amount: stockAmount,
                category,
                deleted: false,
            });

            if (images.length > 0) {
                await tx('product_images').insert(
                    images.map((image) => ({
                        product: id,
                        image_url: image,
                    })),
                );
            }

            return id;
        });
    }

    /**
     * Update a product.
     * @param id - Product id.
     * @param product - Product data.
     */
    public async updateProduct(
        id: number,
        {
            productName,
            description,
            price,
            stockAmount,
            images,
            category,
        }: Partial<Product>,
    ): Promise<void> {
        await this.db.transaction(async (tx) => {
            const product = await tx('products')
                .select('*')
                .where('id', id)
                .first();

            if (!product) {
                throw new ProductNotFoundError(id);
            }

            if (productName) {
                product.product_name = productName;
            }
            if (description) {
                product.description = description;
            }
            if (price) {
                product.price = price;
            }
            if (stockAmount) {
                product.stock_amount = stockAmount;
            }
            if (category) {
                product.category = category;
            }

            await tx('products').where('id', id).update(product);

            if (images) {
                await tx('product_images').where('product', id).delete();

                if (images.length > 0) {
                    await tx('product_images').insert(
                        images.map((image) => ({
                            product: id,
                            image_url: image,
                        })),
                    );
                }
            }
        });
    }

    /**
     * Get all products.
     * @returns Array of products.
     */
    public async getProductById(
        id: number,
        showDeleted: boolean = false,
    ): Promise<Product> {
        const images = await this.db('product_images').where('product', id);
        const rating = await this.getProductRatingQuery()
            .where('product', id)
            .first();
        const product = await this.db('products')
            .where('id', id)
            .modify((b) => {
                if (!showDeleted) {
                    b.where('deleted', false);
                }
            })
            .first();

        if (!product) throw new ProductNotFoundError(id);

        return toProduct(product, images, rating);
    }

    /**
     * Get products by ids.
     * @param ids - Array of product ids.
     * @returns Array of products.
     */
    public async getProductsByIds(
        ids: number[],
        showDeleted: boolean = false,
    ): Promise<Product[]> {
        const images = await this.db('product_images').whereIn('product', ids);
        const ratings = await this.getProductRatingQuery().whereIn(
            'product',
            ids,
        );
        const products = await this.db('products')
            .modify((b) => {
                if (!showDeleted) {
                    b.where('deleted', false);
                }
            })
            .whereIn('products.id', ids);

        return toProducts(products, ratings, images);
    }

    /**
     * Search products.
     * @param query - Search query.
     * @param category - Category.
     * @param page - Page request.
     * @returns Page of products.
     */
    public async searchProducts(
        query?: string,
        category?: string,
        page?: PageRequest,
    ): Promise<Page<Product>> {
        const searchQuery = (builder: Knex.QueryBuilder) => {
            if (query) {
                query = `%${query}%`;

                builder
                    .where('products.product_name', 'like', query)
                    .orWhere('products.description', 'like', query)
                    .orWhere('products.category', 'like', query);
            }
        };

        const categoryQuery = (builder: Knex.QueryBuilder) => {
            category &&
                builder.whereRaw(
                    `LOWER(products.category) = ?`,
                    category.toLowerCase(),
                );
        };

        const whereQuery = (builder: Knex.QueryBuilder) => {
            builder
                .where('deleted', false)
                .where(searchQuery)
                .andWhere(categoryQuery);
        };

        const count = await this.db('products')
            .modify(whereQuery)
            .count({ count: 'products.id' })
            .first();

        if (!count?.count) {
            return {
                data: [],
                total: 0,
                page: page?.page ?? 1,
                pageSize: page?.pageSize ?? 20,
            };
        }

        const byIdQuery = (builder: Knex.QueryBuilder) => {
            builder.select('products.id').from('products').modify(whereQuery);

            if (page?.page) builder.limit(page.pageSize);

            if (page?.page && page.pageSize)
                builder.offset((page.page - 1) * page.pageSize);
        };

        const images = await this.db('product_images').whereIn(
            'product_images.product',
            byIdQuery,
        );
        const ratings = await this.getProductRatingQuery().whereIn(
            'ratings.product',
            byIdQuery,
        );
        const products = await this.db('products').whereIn(
            'products.id',
            byIdQuery,
        );

        return {
            data: toProducts(products, ratings, images),
            total: count.count,
            page: page?.page ?? 1,
            pageSize: page?.pageSize ?? 20,
        };
    }

    /**
     * Delete a product.
     * @param id - Product id.
     * @throws ProductNotFoundError if product is not found.
     * @returns void
     */
    public async deleteProduct(id: number): Promise<void> {
        const rowsAffected = await this.db('products')
            .where('id', id)
            .update({ deleted: true });
        if (rowsAffected === 0) {
            throw new ProductNotFoundError(id);
        }
    }

    /**
     * Returns a query for getting product ratings.
     *
     * @returns Query for getting product ratings.
     */
    private getProductRatingQuery() {
        return this.db('ratings')
            .groupBy('ratings.product')
            .avg('ratings.rating', { as: 'rating' })
            .count('ratings.rating', { as: 'total_ratings' })
            .select<ProductRatingRow[]>('product');
    }
}
