/** Payment model */
export interface Payment {
    /** Unique number */
    id: number;

    /** Month of payment */
    month: number;

    /** Year of payment*/
    year: number;

    /** Amount of paid money */
    price: number;

    /** Number of payment type */
    typeId: number;

    /** Related payment type caption */
    typeCaption: string;

    /** Related payment type color */
    typeColor?: string;

    /** Description */
    description?: string;
}
