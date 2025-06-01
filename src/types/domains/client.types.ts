import { Status } from '../utils/common.types';

/**
 * Represents a client in the system
 */
export interface Client {
  /** Unique identifier for the client */
  id: string;
  /** Full name of the client */
  name: string;
  /** Email address of the client */
  email: string;
  /** Contact phone number */
  phone: string;
  /** Physical address */
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    [key: string]: string | undefined;
  } | string;
  /** Company name */
  company: string;
  /** Additional notes about the client */
  notes: string;
  /** Preferred contact method */
  preferredContact?: string;
  /** Billing address */
  billingAddress?: string;
  /** Shipping address */
  shippingAddress?: string;
  /** Website URL */
  website?: string;
  /** Tax/VAT number */
  taxNumber?: string;
  /** Payment terms */
  paymentTerms?: string;
  /** Credit limit */
  creditLimit?: number;
  /** Discount rate */
  discountRate?: number;
  /** Current status of the client */
  status: 'active' | 'inactive' | 'lead';
  /** Tags for categorization */
  tags?: string[];
  /** ISO timestamp of when the client was created */
  createdAt: string;
  /** ISO timestamp of when the client was last updated */
  updatedAt: string;
}

/**
 * Data required to create a new client
 */
export type CreateClientDTO = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Data required to update an existing client
 */
export type UpdateClientDTO = Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Client status type
 */
export type ClientStatus = 'active' | 'inactive' | 'lead';
