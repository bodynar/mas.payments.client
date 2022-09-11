/** Base lookup type */
export interface Lookup {
    /** Unique number */
    id: number;

    /** System name */
    name: string;

    /** Readable caption */
    caption: string;

    /** Description */
    description?: string;

    /** Hex color */
    color?: string;
}
