/** Generic group of date-based entities */
export interface EntityGroup<TItem> {
    /** Month */
    month: number;

    /** Year */
    year: number;

    /** Group caption */
    caption: string;

    /** Group items */
    items: Array<TItem>;
}
