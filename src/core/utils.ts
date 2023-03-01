import { isNullOrUndefined } from "@bodynarf/utils";

import { SelectableItem } from "@bodynarf/react.components";

/**
 * Find dropdown item by value
 * @param dropdownItems Dropdown items
 * @param item Item value
 * @returns Found dropdown item; otherwise `undefined`
 */
export const getDropdownItem = (dropdownItems: Array<SelectableItem>, item?: number): SelectableItem | undefined => {
    if (isNullOrUndefined(item)) {
        return undefined;
    }

    const foundItem = dropdownItems.find(({ value }) => item === +value);

    return foundItem;
};
