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
