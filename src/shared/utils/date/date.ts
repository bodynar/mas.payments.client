import moment from "moment";

import { isNullOrUndefined } from "@bodynarf/utils";

import { DateModel, LookupDate } from "@app/models";

/**
 * Build date object from lookup date values
 * @param param0 Lookup date value
 * @returns Date object if date is defined; otherwise - `undefined`
 */
export const getDateIfDefined = ({ month, year }: LookupDate): DateModel | undefined => {
    if (isNullOrUndefined(month) || isNullOrUndefined(year)) {
        return undefined;
    }

    return {
        day: 1,
        month: +month!.value,
        year: +year!.value,
    };
};

/**
 * Get date object for current date
 * @returns Date object
 */
export const getNowDate = (): DateModel => {
    const { date, months, years } = moment().toObject();

    return {
        day: date,
        month: months + 1,
        year: years,
    };
};
