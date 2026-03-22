/** Payment item within a group */
export interface AddPaymentGroupItem {
    /** Temporary unique identifier */
    id: string;

    /** Payment amount */
    amount?: number;

    /** Description */
    description?: string;

    /** Payment type identifier */
    paymentTypeId?: string;
}

/** Add payment group request model */
export interface AddPaymentGroup {
    /** Payment date (ISO 8601) */
    paymentDate?: string;

    /** Month of payment (1-12) */
    month?: number;

    /** Year of payment */
    year?: number;

    /** Comment */
    comment?: string;

    /** Payment items */
    payments: Array<AddPaymentGroupItem>;
}
