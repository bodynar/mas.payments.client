/** Measurement type API response */
export interface MeasurementTypeResponse {
    id: number;
    systemName: string;
    name: string;
    hasRelatedMeasurements: boolean;
    paymentTypeId: number;
    paymentTypeName: string;
    paymentTypeColor?: string;
    color?: string;
    description?: string;
}
