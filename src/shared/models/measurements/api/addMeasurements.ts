/** Add measurements model */
export interface AddMeasurements {
    /** Year of measurement */
    year?: number;

    /** Month of measurement */
    month?: number;

    /** Adding measurement data items */
    measurements: Array<AddMeasurementRecordData>;
}

/** Measurement data */
export interface AddMeasurementRecordData {
    /** Temporary unique identifier */
    id: string;

    /** Type identifier */
    typeId?: number;

    /** Value */
    value?: number;

    /** Optional comment*/
    comment?: string;

    previousValues: Array<{
        typeId: number;

        value: number;
    }>;
}
