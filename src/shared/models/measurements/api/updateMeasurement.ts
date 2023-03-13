/** Update single measurement item */
export interface UpdateMeasurement {
    /** Unique measurement identifier */
    id: number;

    /** Year of measurement */
    year: number;

    /** Month of measurement */
    month: number;

    /** Type identifier */
    typeId: number;

    /** Value */
    value: number;

    /** Optional comment*/
    comment?: string;
}
