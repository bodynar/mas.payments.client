/** Measurement model */
export interface Measurement {
    /** Unique identifier */
    id: string;

    /** Month of measurement */
    month: number;

    /** Year of measurement*/
    year: number;

    /** Measurement value */
    value: number;

    /** Diff with previous item */
    diff: number | null;

    /** Identifier of measurement type */
    typeId: string;

    /** Description */
    description?: string;

    /** Whether measurement was sent */
    isSent: boolean;
}
