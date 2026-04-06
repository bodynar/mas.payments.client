/** Model for adding new payment */
export interface AddPayment {
    /** Amount of paid money */
    amount: number;

    /** Year of payment*/
    year: number;

    /** Month of payment */
    month: number;

    /** Description */
    description?: string;

    /** Identifier of payment type */
    paymentTypeId: string;
}

/** Model for update existed payment */
export interface UpdatePayment extends AddPayment {
    /** Unique identifier of payment */
    id: string;
}

/** Typed payload for creating or updating a payment from the edit form */
export interface SavePaymentData {
    /** Amount of paid money */
    amount: number;

    /** Month of payment (1-12) */
    month: number;

    /** Year of payment */
    year: number;

    /** Identifier of payment type */
    paymentTypeId: string;

    /** Description */
    description?: string;
}
