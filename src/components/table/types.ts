export interface TableHeading<TItem> {
    /** Caption to display */
    caption: string;

    /** Is column sortable  */
    sortable: boolean;

    /** Class names */
    className: string;

    /** Name of model column*/
    name?: keyof TItem;
}
