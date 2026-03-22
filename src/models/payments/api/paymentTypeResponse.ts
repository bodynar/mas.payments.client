/** Payment type API response */
export interface PaymentTypeResponse {
    id: string;
    systemName: string | null;
    name: string;
    hasRelatedMeasurementTypes: boolean;
    hasRelatedPayments: boolean;
    color: string;
    company: string | null;
    description: string;
}
