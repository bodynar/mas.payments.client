/** Measurement type API response */
export interface MeasurementTypeResponse {
    id: string;
    systemName: string | null;
    name: string;
    hasRelatedMeasurements: boolean;
    paymentTypeId: string;
    paymentTypeName: string;
    paymentTypeColor: string;
    color: string;
    description: string;
}
