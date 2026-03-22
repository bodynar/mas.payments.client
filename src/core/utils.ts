import { isNullish } from "@bodynarf/utils";

import { SelectableItem } from "@bodynarf/react.components";
import { FieldValue } from "@bodynarf/react.components.form";

/**
 * Get a required form field value by key. Throws if the field is not found.
 * @param values Array of form field values
 * @param key Field key
 * @returns Field value entry
 */
export const getRequiredFieldValue = (values: Array<FieldValue>, key: string): FieldValue => {
    const field = values.find((f) => f.key === key);

    if (isNullish(field)) {
        throw new Error(`Required form field "${key}" was not found.`);
    }

    return field!;
};

/**
 * Find dropdown item by value
 * @param dropdownItems Dropdown items
 * @param item Item value
 * @returns Found dropdown item; otherwise `undefined`
 */
export const getDropdownItem = (
    dropdownItems: Array<SelectableItem>,
    item?: string | number
): SelectableItem | undefined => {
    if (isNullish(item)) {
        return undefined;
    }

    const itemStr = String(item);
    const foundItem = dropdownItems.find(({ value }) => itemStr === value);

    return foundItem;
};
