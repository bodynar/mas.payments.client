import { Measurement } from ".";

/** Measurements grouped by year-month */
export interface MeasurementGroup {
    /** Month of measurement */
    month: number;

    /** Year of measurement */
    year: number;

    /** Group caption */
    caption: string;

    /** Group items */
    items: Array<Measurement>;
}
