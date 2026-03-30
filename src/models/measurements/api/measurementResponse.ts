/** Measurement record API response */
export interface MeasurementResponse {
    id: string;
    dateMonth: number;
    dateYear: number;
    measurement: number;
    diff: number | null;
    meterMeasurementTypeId: string;
    measurementTypeName: string;
    measurementTypeColor: string;
    comment: string;
    isSent: boolean;
}
