import { Status } from '../utils/common.types';

/**
 * Invoice line item
 */
export interface InvoiceItem {
  /** Description of the item */
  description: string;
  /** Quantity */
  quantity: number;
  /** Price per unit */
  unitPrice: number;
  /** Total amount for this line item */
  amount: number;
}

/**
 * Represents an invoice in the system
 */
export interface Invoice {
  /** Unique identifier for the invoice */
  id: string;
  /** ID of the client this invoice is for */
  clientId: string;
  /** ID of the project this invoice is for */
  projectId: string;
  /** Total invoice amount */
  amount: number;
  /** Current status of the invoice */
  status: Status.DRAFT | Status.SENT | Status.PAID | Status.OVERDUE | Status.CANCELLED;
  /** Date when the invoice was issued */
  issueDate: string;
  /** Due date for payment */
  dueDate: string;
  /** Date when the invoice was paid (if applicable) */
  paidDate?: string;
  /** Line items in the invoice */
  items: InvoiceItem[];
  /** Additional notes */
  notes?: string;
  /** ISO timestamp of when the invoice was created */
  createdAt: string;
  /** ISO timestamp of when the invoice was last updated */
  updatedAt: string;
}

/**
 * Data required to create a new invoice
 */
export type CreateInvoiceDTO = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Data required to update an existing invoice
 */
export type UpdateInvoiceDTO = Partial<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>>;
