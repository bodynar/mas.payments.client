import { DependencyList, useCallback } from "react";

import { isNullOrUndefined } from "@bodynarf/utils";
import { TableHeading } from "@bodynarf/react.components/components/table";

import { SortColumn } from "@app/models";

/**
 * Create a hook to get saving sort column function
 * @param saveSortColumn Function to save new sort column
 * @param currentSortColumn Current sort column
 * @param dependencies Additional dependencies to update hook
 * @returns Callback to save new sort column
 */
export const useSortColumn = <TModel>(
    saveSortColumn: (column: SortColumn<TModel>) => void,
    currentSortColumn?: SortColumn<TModel>,
    dependencies?: DependencyList,
): (column: TableHeading) => void => {
    const callback = useCallback(
        (column: TableHeading) => {
            const isAsc = isNullOrUndefined(currentSortColumn)
                ? true
                : currentSortColumn!.columnName === column.name!
                    ? !currentSortColumn!.ascending
                    : true;

            saveSortColumn({
                ascending: isAsc,
                columnName: column.name! as keyof TModel
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [currentSortColumn, saveSortColumn, ...(dependencies ?? [])]
    );

    return callback;
};
