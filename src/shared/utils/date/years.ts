import { SelectableItem } from "@bodynarf/react.components";

const START_YEAR = 2019; // First year of records in the system

/**
 * @private
 * Cached years for dropdown component
 */
let _yearsAsDropdownItems: Array<SelectableItem> = [];

/**
 * Get years as items for dropdown component
 * @returns Array of years (from 2019 to current year) as selectable items
 */

export const yearsAsDropdownItems = (): Array<SelectableItem> => {
    if (_yearsAsDropdownItems.length === 0) {
        _yearsAsDropdownItems = Array
            .from({ length: new Date().getFullYear() - (START_YEAR - 1) }, (_, i) => `${i + START_YEAR}`)
            .map(x => ({
                displayValue: x,
                id: x,
                value: x,
            }))
            .reverse();
    }

    return _yearsAsDropdownItems;
};
