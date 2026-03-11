/** Payment record API response */
export interface PaymentResponse {
    id: number;
    dateMonth: number;
    dateYear: number;
    amount: number;
    paymentTypeId: number;
    paymentTypeName: string;
    paymentTypeColor?: string;
    description?: string;
}
