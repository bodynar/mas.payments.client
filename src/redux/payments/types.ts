import { SelectableItem } from "@bodynarf/react.components";

import { PaymentType, Payment, PaymentFilter } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

/** Payment module state */
export type PaymentModuleState = {
    /** Is module state initialized */
    initialized: boolean;

    /** All payments */
    payments: Array<Payment>;

    /** Payments thats satisfy last filter */
    filteredItems: Array<Payment>;

    /** All payment types */
    availableTypes: Array<PaymentType>;

    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Last payments applied filter */
    lastFilter?: PaymentFilter;

    /** Current payment sort column config */
    paymentSortColumn?: SortColumn<Payment>;

    /** Current payment type sort column config */
    paymentTypeSortColumn?: SortColumn<PaymentType>;
};
