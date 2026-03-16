/** Measurement record API response */
export interface MeasurementResponse {
    id: number;
    dateMonth: number;
    dateYear: number;
    measurement: number;
    diff: number;
    meterMeasurementTypeId: number;
    measurementTypeName: string;
    measurementTypeColor?: string;
    comment?: string;
}
