import { Payment } from ".";

export interface PaymentGroup {
    /** Month of payment */
    month: number;

    /** Year of payment*/
    year: number;

    /** Group caption */
    caption: string;

    /** Group items */
    items: Array<Payment>;
}
