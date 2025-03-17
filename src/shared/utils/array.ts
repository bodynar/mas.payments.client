import { isNullOrUndefined } from "@bodynarf/utils";

import { SortColumn } from "@app/models";

/** Filter value */
export interface FilterValue<TModel> {
    /** Name of column */
    key: keyof TModel;

    /** Comparison value */
    value: any;
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

/**
 * Sort array of items by sort column config
 * @param items Array of items
 * @param sortColumn Sort column configuration
 * @returns Sorted array of items
 */
export const sort = <TModel>(items: Array<TModel>, sortColumn: SortColumn<TModel>): Array<TModel> => {
    if (isNullOrUndefined(sortColumn)) {
        return items;
    }

    const sortedItems = [...items];

    sortedItems.sort((prev, curr) => {
        const prevValue = prev[sortColumn.columnName];
        const currValue = curr[sortColumn.columnName];

        const comparisonResult = compare(prevValue, currValue);

        return comparisonResult * (sortColumn.ascending ? 1 : -1);
    });

    return sortedItems;
};

/**
 * Compare two values
 * @param left Previous value
 * @param right Next value
 * @returns `1` if previous value is greater than next, `-1` otherwise, `0` if values are equal
 */
const compare = (left: any, right: any): number => {
    if (isNullOrUndefined(left) && isNullOrUndefined(right)) {
        return 0;
    }

    if (isNullOrUndefined(left)) {
        return 1;
    }

    if (isNullOrUndefined(right)) {
        return -1;
    }

    if (right < left) {
        return -1;
    }

    if (right > left) {
        return 1;
    }

    return 0;
};
