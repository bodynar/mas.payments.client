/** Update single measurement item */
export interface UpdateMeasurement {
    /** Unique measurement identifier */
    id: string;

    /** Year of measurement */
    year: number;

    /** Month of measurement */
    month: number;

    /** Type identifier */
    typeId: string;

    /** Value */
    value: number;

    /** Optional comment*/
    comment?: string;
}
