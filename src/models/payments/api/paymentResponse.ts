/** Payment file attached to payment */
export interface PaymentFileResponse {
    id: string;
    fileName: string;
}

/** Payment record API response */
export interface PaymentResponse {
    id: string;
    dateMonth: number;
    dateYear: number;
    amount: number;
    paymentTypeId: string;
    paymentTypeName: string;
    paymentTypeColor: string;
    description: string;
    paymentGroupId: string | null;
    paymentFile: PaymentFileResponse | null;
}
