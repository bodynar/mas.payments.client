import { isNullOrEmpty } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";

import { Month } from "@app/models";
import { months } from "@app/static";

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
 * Get short month name by its number
 * @param monthNumber Number of month
 * @returns Short name of month in 3 characters lenght
 * @throws Month number isn"t in (0, 12) range 
 */
export const getShortMonthName = (monthNumber: number): string => {
    const monthName: string = getMonthName(monthNumber);

    return isNullOrEmpty(monthName) ? monthName : monthName.substring(0, 3);
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
