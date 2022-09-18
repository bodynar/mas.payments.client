import { isNullOrUndefined } from "@bodynarf/utils";

/**
 * Filter array by key values
 * @param array Array
 * @param selector Key selector
 * @param keys Keys to remove
 * @returns Filtered array
 */
export function removeByKey<TItem, TValue>(
    array: Array<TItem>,
    selector: (item: TItem) => TValue,
    keys: Array<TValue>
): Array<TItem> {
    return array.filter(item => {
        const value = selector(item);

        return !keys.includes(value);
    });
}


/** Filter value */
export interface FilterValue<TModel> {
    /** Name of column */
    key: keyof TModel;
    
    /** Comparison value */
    value: any;

    // TODO: add comparison operator
}

/**
 * Filter items by specified filters
 * @param items Array of items to filter
 * @param filters Array of filter values
 * @returns Array that was filtered
 */
export const filter = <TModel>(items: Array<TModel>, filters: Array<FilterValue<TModel>>): Array<TModel> => {
    let result = [...items];

    if (isNullOrUndefined(filters)) {
        return result;
    }

    filters.forEach(({ key, value }) => result = result.filter(x => x[key] === value));

    return result;
};
