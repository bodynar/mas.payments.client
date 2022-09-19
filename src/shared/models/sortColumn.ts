/** Generic sort column model */
interface SortColumn<TModel> {
    /** Column name */
    columnName: keyof TModel;

    /** Is column sorted ascendingly */
    ascending: boolean;
}

export default SortColumn;
