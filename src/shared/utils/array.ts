import { isNullish } from "@bodynarf/utils";

import { SortColumn } from "@app/models";

/** Filter value */
export interface FilterValue<TModel> {
    /** Name of column */
    key: keyof TModel;

    /** Comparison value */
    value: TModel[keyof TModel];
}

/**
 * Filter items by specified filters
 * @param items Array of items to filter
 * @param filters Array of filter values
 * @returns Array that was filtered
 */
export const filter = <TModel>(items: Array<TModel>, filters: Array<FilterValue<TModel>>): Array<TModel> => {
    let result = [...items];

    if (isNullish(filters)) {
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
    if (isNullish(sortColumn)) {
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
const compare = (left: unknown, right: unknown): number => {
    if (isNullish(left) && isNullish(right)) {
        return 0;
    }

    if (isNullish(left)) {
        return 1;
    }

    if (isNullish(right)) {
        return -1;
    }

    if ((right as number) < (left as number)) {
        return -1;
    }

    if ((right as number) > (left as number)) {
        return 1;
    }

    return 0;
};
