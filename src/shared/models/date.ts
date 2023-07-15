import { SimpleLookup } from "./lookup";

/** Date */
export interface DateModel {
    /** Day */
    day: number;

    /** Month */
    month: number;

    /** Year */
    year: number;
}

/** Month as lookup model */
export type Month = SimpleLookup;
