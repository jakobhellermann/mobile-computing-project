import { Address } from 'shared';
import { AddressRow } from '../database/rows';

/**
 * Convert address row to address.
 * @param row - Address row.
 * @returns Address.
 */
export function toAddress(row: AddressRow): Address {
    return {
        id: row.id,
        name: row.name,
        firstName: row.first_name,
        company: row.company,
        street: row.street,
        city: row.city,
        zip: row.zip,
        country: row.country,
    };
}

/**
 * Convert address rows to addresses.
 * @param rows - Address rows.
 * @returns Addresses.
 */
export function toAddresses(rows: AddressRow[]): Address[] {
    return rows.map(toAddress);
}
