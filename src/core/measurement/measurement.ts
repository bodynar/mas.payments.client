import { isNullOrUndefined } from "@bodynarf/utils";

import { filter, FilterValue, get, post } from "@app/utils";
import { Measurement, MeasurementFilter, MeasurementGroup } from "@app/models/measurements";
import { getMonthName } from "@app/constants";

/**
 * Load all available measurement records
 * @returns Promise with array of loaded measurements
 */
export const getMeasurements = async (): Promise<Array<Measurement>> => {
    const items = await get<Array<any>>("api/measurement/getMeasurements");

    return items.map(x => ({
        id: x["id"],
        month: x["dateMonth"],
        year: x["dateYear"],
        value: x["measurement"],
        typeId: x["meterMeasurementTypeId"],
        typeCaption: x["measurementTypeName"],
        typeColor: x["measurementTypeColor"],
        description: x["comment"],
    }) as Measurement);
};

/**
 * Filter measurement items array by specified filter
 * @param items Measurement items
 * @param filterValue Filter object with values
 * @returns Filtered array
 */
export const filterMeasurementList = (items: Array<Measurement>, filterValue?: MeasurementFilter): Array<Measurement> => {
    if (isNullOrUndefined(filterValue)) {
        return items;
    }

    const { month, year, typeId } = filterValue!;

    const filters: Array<FilterValue<Measurement>> = [];

    if (!isNullOrUndefined(month) && !isNaN(month!)) {
        filters.push({
            key: "month",
            value: month!
        });
    }

    if (!isNullOrUndefined(year) && !isNaN(year!)) {
        filters.push({
            key: "year",
            value: year!
        });
    }

    if (!isNullOrUndefined(typeId) && !isNaN(typeId!)) {
        filters.push({
            key: "typeId",
            value: typeId!
        });
    }

    return filter([...items], filters);
};

/**
 * Delete specified measurement type
 * @param id Measurement type identifier
 * @returns Promise of sending request to API
 */
export const deleteMeasurement = (id: number): Promise<void> => {
    return post("/api/measurement/deleteMeasurement", { id }); // TODO: update API
};

/**
 * Group measurements by year and month
 * @param items Measurement records
 * @param isAscOrder Sort groups ascendingly by month&year
 * @returns Array of grouped measurements
 */
export const groupMeasurements = (
    items: Array<Measurement>,
    isAscOrder: boolean
): Array<MeasurementGroup> => {
    let result: Array<MeasurementGroup> = [];

    items.forEach(item => {
        const group = result.find(({ year, month }) => year === item.year && month === item.month);

        if (isNullOrUndefined(group)) {
            result.push({
                caption: `${item.year} ${getMonthName(item.month)}`,
                month: item.month,
                year: item.year,
                items: [item],
            });
        } else {
            group!.items = [...group!.items, item].sort((left, right) => left.month - right.month);
        }
    });

    result = result.sort((left, right) => {
        if (left.year === right.year) {
            return (left.month - right.month) * (isAscOrder ? -1 : 1);
        }

        return (left.year - right.year) * (isAscOrder ? -1 : 1);
    });

    return result;
};
