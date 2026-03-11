/** Generic filter for date-based entities */
export interface EntityFilter {
    /** Month */
    month?: number;

    /** Year */
    year?: number;

    /** Type identifier */
    typeId?: number;
}
