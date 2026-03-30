/** Payment file info */
export interface PaymentFile {
    /** Unique identifier */
    id: string;

    /** File name */
    fileName: string;
}

/** Payment model */
export interface Payment {
    /** Unique identifier */
    id: string;

    /** Month of payment */
    month: number;

    /** Year of payment*/
    year: number;

    /** Amount of paid money */
    price: number;

    /** Identifier of payment type */
    typeId: string;

    /** Description */
    description?: string;

    /** Identifier of payment group */
    paymentGroupId?: string;

    /** Attached payment file */
    paymentFile?: PaymentFile;
}
