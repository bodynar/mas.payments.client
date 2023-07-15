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
    paymentTypeId: number;
}

/** Model for update existed payment */
export interface UpdatePayment extends AddPayment {
    /** Unique number of payment */
    id: number;
}
