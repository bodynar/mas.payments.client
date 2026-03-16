import { isNullish, isNotNullish } from "@bodynarf/utils";

import { EntityFilter, EntityGroup } from "@app/models";
import { filter, FilterValue, getMonthName } from "@app/utils";

/** Entity with date fields required for grouping/filtering */
type DateBasedEntity = Required<EntityFilter>;

/**
 * Group date-based entities by year and month
 * @param items Entity records
 * @param isAscOrder Sort groups ascending by month&year
 * @returns Array of grouped entities
 */
export const groupByYearMonth = <T extends DateBasedEntity>(
    items: Array<T>,
    isAscOrder: boolean,
): Array<EntityGroup<T>> => {
    let result: Array<EntityGroup<T>> = [];

    items.forEach(item => {
        const group = result.find(({ year, month }) => year === item.year && month === item.month);

        if (isNullish(group)) {
            result.push({
                caption: `${item.year} ${getMonthName(item.month)}`,
                month: item.month,
                year: item.year,
                items: [item],
            });
        } else {
            group.items = [...group.items, item].sort((left, right) => left.month - right.month);
        }
    });

    result = result.sort((left, right) => {
        if (left.year === right.year) {
            return (left.month - right.month) * (isAscOrder ? 1 : -1);
        }

        return (left.year - right.year) * (isAscOrder ? 1 : -1);
    });

    return result;
};

/**
 * Filter date-based entities by specified filter values
 * @param items Entity items
 * @param filterValue Filter object with values
 * @returns Filtered array
 */
export const filterEntities = <T extends DateBasedEntity>(
    items: Array<T>,
    filterValue?: EntityFilter,
): Array<T> => {
    if (isNullish(filterValue)) {
        return items;
    }

    const { month, year, typeId } = filterValue;

    const filters: Array<FilterValue<T>> = [];

    if (isNotNullish(month) && !isNaN(month!)) {
        filters.push({ key: "month" as keyof T, value: month as T[keyof T] });
    }

    if (isNotNullish(year) && !isNaN(year!)) {
        filters.push({ key: "year" as keyof T, value: year as T[keyof T] });
    }

    if (isNotNullish(typeId) && !isNaN(typeId!)) {
        filters.push({ key: "typeId" as keyof T, value: typeId as T[keyof T] });
    }

    return filter([...items], filters);
};
