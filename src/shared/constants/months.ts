import { SelectableItem } from "@bodynarf/react.components";

/** Month */
export interface Month {
    /** Number */
    id: number;

    /** Name */
    name: string;
}

/** Month list */
export const months: Array<Month> = [
    {
        id: 1,
        name: "January"
    },
    {
        id: 2,
        name: "February"
    },
    {
        id: 3,
        name: "March"
    },
    {
        id: 4,
        name: "April"
    },
    {
        id: 5,
        name: "May"
    },
    {
        id: 6,
        name: "June"
    },
    {
        id: 7,
        name: "July"
    },
    {
        id: 8,
        name: "August"
    },
    {
        id: 9,
        name: "September"
    },
    {
        id: 10,
        name: "October"
    },
    {
        id: 11,
        name: "November"
    },
    {
        id: 12,
        name: "December"
    },
];

/**
 * Get month name by its number
 * @param monthNumber Number of month
 * @returns Name of month
 * @throws Month number isn"t in (0, 12) range 
 */
export const getMonthName = (monthNumber: number): string => {
    if (monthNumber < 0 || monthNumber > 12) {
        throw new Error("Month number must be in (0, 12) range.");
    }

    const month: Month = months.find(x => x.id === monthNumber)!;

    return month?.name;
};

/**
 * @private
 * Cached months for dropdown component
 */
let _monthsAsDropdownItems: Array<SelectableItem> = [];

/**
 * Get months as items for dropdown component
 * @returns Array of month as selectable items
 */
export const monthsAsDropdownItems = (): Array<SelectableItem> => {
    if (_monthsAsDropdownItems.length === 0) {
        _monthsAsDropdownItems = months.map(x => ({
            displayValue: x.name,
            id: x.id.toString(),
            value: x.id.toString(),
        }));
    }

    return _monthsAsDropdownItems;
};
