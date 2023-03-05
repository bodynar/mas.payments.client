import { SelectableItem } from "@bodynarf/react.components/components/dropdown/types";

/**
 * @private
 * Cached years for dropdown component
 */
let _yearsAsDropdownItems: Array<SelectableItem> = [];

/**
 * Get years as items for dropdown component
 * @returns Array of years (from 2019 to current year) as selectable items
 */
export const yearsAsDropdownItems = (reverse?: boolean): Array<SelectableItem> => {
    if (_yearsAsDropdownItems.length === 0) {
        _yearsAsDropdownItems = Array
            .from({ length: new Date().getFullYear() - 2018 }, (_, i) => `${i + 2019}`)
            .map(x => ({
                displayValue: x,
                id: x,
                value: x,
            }));
    }

    return reverse === true ? _yearsAsDropdownItems.sort(_ => -1) : _yearsAsDropdownItems;
};
