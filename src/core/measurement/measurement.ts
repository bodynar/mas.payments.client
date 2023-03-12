import { isNullOrUndefined } from "@bodynarf/utils";

import { filter, FilterValue, get } from "@app/utils";
import { Measurement, MeasurementFilter } from "@app/models/measurements";

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
