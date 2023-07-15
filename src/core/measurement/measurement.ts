import { isNullOrUndefined } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";
import { FieldValue } from "@bodynarf/react.components.form";

import { filter, FilterValue, get, post, getMonthName } from "@app/utils";
import { AddMeasurementRecordData, AddMeasurements, Measurement, MeasurementFilter, MeasurementGroup, MeasurementGroupedByType, UpdateMeasurement } from "@app/models/measurements";

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

/**
 * Save create measurement card with several possible measurements
 * @param measurementsData Measurements data
 * @returns Promise without any data
 */
export const createMeasurements = (measurementsData: AddMeasurements): Promise<void> => {
    return post("api/measurement/addMeasurement", measurementsData);
};

/**
 * Update measurement with specified identifier by specific form values
 * @param values Measurement card form values
 * @param id Measurement identifier
 * @returns Promise without any data
 */
export const updateMeasurement = (values: Array<FieldValue>, id: string): Promise<void> => {
    const apiModel: UpdateMeasurement = {
        id: +id,
        value: +values.find(({ key }) => key === "value")!.value,
        month: +(values.find(({ key }) => key === "month")!.value as SelectableItem).value,
        year: +(values.find(({ key }) => key === "year")!.value as SelectableItem).value,
        typeId: +(values.find(({ key }) => key === "type")!.value as SelectableItem).value,
        comment: values.find(({ key }) => key === "comment")?.value,
    };

    return post("api/measurement/updateMeasurement", apiModel);
};

/**
 * Validate single measurement item
 * @param param0 Measurement create single item data
 * @returns Validation error if there's something; otherwise - `undefined`
 */
export const validateMeasurementCreateData = (
    { typeId, value, previousValues }: AddMeasurementRecordData
): string | undefined => {
    if (isNullOrUndefined(typeId)) {
        return "Type is not selected";
    }

    if (isNullOrUndefined(value)) {
        return "Value is not valid";
    }

    if (value! <= 0) {
        return "Value cannot be less or equal to 0";
    }

    const previousValue = previousValues.find(previous => previous.typeId === typeId)?.value;

    if (!isNullOrUndefined(previousValue)) {
        if (previousValue! > value!) {
            return "Value cannot be less than previous value";
        }

        if (previousValue! === value!) {
            return "Value is not changed";
        }
    }

    return undefined;
};

/**
 * Group measurement items by `typeId` value
 * @param items Measurement items
 * @returns Measurements grouped by type
 */
export const groupMeasurementsByType = (items: Array<Measurement>): Array<MeasurementGroupedByType> => {
    return items.groupBy('typeId');
};
