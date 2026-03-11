import { isNullish } from "@bodynarf/utils";

import { DateModel, LookupDate } from "@app/models";
import { getDropdownItem } from "@app/core";

import { monthsAsDropdownItems, yearsAsDropdownItems } from ".";

/**
 * Build date object from lookup date values
 * @param param0 Lookup date value
 * @returns Date object if date is defined; otherwise - `undefined`
 */
export const getDateIfDefined = ({ month, year }: LookupDate): DateModel | undefined => {
    if (isNullish(month) || isNullish(year)) {
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
    const now = new Date();

    return {
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
    };
};

/**
 * Get current date as lookup values
 * @returns Current date as lookup values
 */
export const getNowDateLookup = (): LookupDate => {
    const { month, year } = getNowDate();

    return {
        month: getDropdownItem(monthsAsDropdownItems(), month),
        year: getDropdownItem(yearsAsDropdownItems(), year),
    };
};

/**
 * Get lookup date model if dates defined in specified model; Otherwise - get current date
 * @param model Model with date values
 * @returns Lookup values for date controls
 */
export const getDateOrNowLookup = (model?: ModelWithDate): LookupDate => {
    if (isNullish(model)) {
        return getNowDateLookup();
    }

    const { month, year } = model!;

    return {
        month: getDropdownItem(monthsAsDropdownItems(), month),
        year: getDropdownItem(yearsAsDropdownItems(), year),
    };
};

/** Some model that contains date props */
type ModelWithDate = {
    month: number;
    year: number;
};
