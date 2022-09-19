import { isNullOrUndefined } from "@bodynarf/utils";

import SortColumn from "@app/models/sortColumn";

/**
 * Sort array of items by sort column config
 * @param items Array of items
 * @param sortColumn Sort column configuration
 * @returns Sorted array of items
 */
const sort = <TModel>(items: Array<TModel>, sortColumn: SortColumn<TModel>): Array<TModel> => {
    if (isNullOrUndefined(sortColumn)) {
        return items;
    }

    // TODO:

    return items.sort((prev, curr) => {
        const prevValue = prev[sortColumn.columnName];
        const currValue = curr[sortColumn.columnName];

        if (isNullOrUndefined(prevValue) && isNullOrUndefined(currValue)) {
            return 0;
        }

        if (typeof prevValue === "string") {
            return sortColumn.ascending
                ? prevValue.localeCompare(currValue as string)
                : (currValue as string).localeCompare(prevValue);
        }

        return ((prevValue as number) - (currValue as number)) * (sortColumn.ascending ? 1 : -1);
    });
};

export default sort;
