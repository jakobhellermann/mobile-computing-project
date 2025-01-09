import { Knex } from 'knex';
import { toAddress, toAddresses } from '../mappers/address';
import { Address } from 'web-shop-shared';
import { AddressNotFoundError } from '../errors/address';

/**
 * Service for managing addresses.
 */
export default class AddressService {
    /**
     * Creates an instance of AddressService.
     * @param db - Knex instance.
     * @returns AddressService instance.
     */
    public constructor(private readonly db: Knex) {}

    /**
     * Get address by id.
     * @param addressId - Address id.
     * @param userId - User id.
     * @returns Address.
     * @throws AddressNotFoundError if address is not found.
     */
    public async getAddressById(addressId: number, userId: number) {
        const row = await this.db('addresses')
            .where({
                id: addressId,
                user: userId,
            })
            .first();

        if (!row) {
            throw new AddressNotFoundError();
        }

        return toAddress(row);
    }

    /**
     * Get addresses by user id.
     * @param userId - User id.
     * @returns Array of addresses.
     */
    public async getAddresses(userId: number) {
        const rows = await this.db('addresses').where('user', userId);
        return toAddresses(rows);
    }

    /**
     * Delete address by id.
     * @param addressId - Address id.
     * @param userId - User id.
     * @throws AddressNotFoundError if address is not found.
     */
    public async deleteAddress(addressId: number, userId: number) {
        const rowsAffected = await this.db('addresses')
            .where({
                id: addressId,
                user: userId,
            })
            .delete();

        if (rowsAffected === 0) {
            throw new AddressNotFoundError();
        }
    }

    /**
     * Create address.
     * @param userId - User id.
     * @param address - Address data.
     */
    public async createAddress(userId: number, address: Omit<Address, 'id'>) {
        await this.db('addresses').insert({
            city: address.city,
            company: address.company,
            country: address.country,
            first_name: address.firstName,
            name: address.name,
            street: address.street,
            user: userId,
            zip: address.zip,
        });
    }

    /**
     * Update address.
     * @param userId - User id.
     * @param address - Address data.
     * @throws AddressNotFoundError if address is not found.
     */
    public async updateAddress(userId: number, address: Address) {
        const rowsAffected = await this.db('addresses')
            .where({
                id: address.id,
                user: userId,
            })
            .update({
                city: address.city,
                company: address.company,
                country: address.country,
                first_name: address.firstName,
                name: address.name,
                street: address.street,
                zip: address.zip,
            });

        if (rowsAffected === 0) {
            throw new AddressNotFoundError();
        }
    }
}
