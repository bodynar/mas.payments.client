import { SelectableItem } from "@bodynarf/react.components";

/** Date model built by 2 lookups */
export interface LookupDate {
    /** Selected year lookup value */
    year?: SelectableItem;

    /** Selected month lookup value */
    month?: SelectableItem
}
