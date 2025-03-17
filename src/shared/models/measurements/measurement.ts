/** Measurement model */
export interface Measurement {
    /** Unique number */
    id: number;

    /** Month of measurement */
    month: number;

    /** Year of measurement*/
    year: number;

    /** Measurement value */
    value: number;

    /** Diff with previous item */
    diff: number;

    /** Number of measurement type */
    typeId: number;

    /** Related measurement type caption */
    typeCaption: string;

    /** Related measurement type color */
    typeColor?: string;

    /** Description */
    description?: string;
}
