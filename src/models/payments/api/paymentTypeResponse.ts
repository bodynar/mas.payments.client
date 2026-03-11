/** Payment type API response */
export interface PaymentTypeResponse {
    id: number;
    systemName: string;
    name: string;
    hasRelatedMeasurementTypes: boolean;
    hasRelatedPayments: boolean;
    color?: string;
    company?: string;
    description?: string;
}
