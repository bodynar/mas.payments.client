/** Generic sort column model */
export interface SortColumn<TModel> {
    /** Column name */
    columnName: keyof TModel;

    /** Is column sorted ascending */
    ascending: boolean;
}
