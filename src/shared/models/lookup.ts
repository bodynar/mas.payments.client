/** Simple lookup value as key-value pair */
export interface SimpleLookup {
    /** Unique number */
    id: number;

    /** System name */
    name: string;
}

/** Base lookup type */
export interface Lookup extends SimpleLookup {
    /** Readable caption */
    caption: string;

    /** Description */
    description?: string;

    /** Hex color */
    color?: string;
}
