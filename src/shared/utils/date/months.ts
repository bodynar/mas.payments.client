import { SelectableItem } from "@bodynarf/react.components";

/**
 * Get month name by its number
 * @param monthNumber Number of month
 * @returns Name of month
 * @throws Month number isn"t in [1, 12] range
 */
export const getMonthName = (monthNumber: number): string => {
    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error("Month number must be in [1, 12] range.");
    }

    return new Intl.DateTimeFormat(undefined, { month: "long" }).format(new Date(2000, monthNumber - 1, 1));
};

/**
 * Get short month name by its number
 * @param monthNumber Number of month
 * @returns Localized short name of month
 * @throws Month number isn"t in [1, 12] range
 */
export const getShortMonthName = (monthNumber: number): string => {
    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error("Month number must be in [1, 12] range.");
    }

    return new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(2000, monthNumber - 1, 1));
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
        _monthsAsDropdownItems = Array.from({ length: 12 }, (_, i) => ({
            displayValue: getMonthName(i + 1),
            id: (i + 1).toString(),
            value: (i + 1).toString(),
        }));
    }

    return _monthsAsDropdownItems;
};
