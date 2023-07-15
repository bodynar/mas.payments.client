import { SelectableItem } from "@bodynarf/react.components";

import { PaymentType, Payment, PaymentFilter } from "@app/models/payments";
import { SortColumn } from "@app/models";

/** Payment module state */
export interface PaymentModuleState {
    /** Is module state initialized */
    initialized: boolean;

    /** All payments */
    payments: Array<Payment>;

    /** Payments thats satisfy last filter */
    filteredItems: Array<Payment>;

    /** All payment types */
    availableTypes: Array<PaymentType>;

    /** Payment types filtered by caption */
    filteredTypes: Array<PaymentType>;

    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /**
     * Display payments grouped by year.
     * @default false
    */
    useGroupedView: boolean;

    /** Last payments applied filter */
    lastFilter?: PaymentFilter;

    /** Current payment sort column config */
    paymentSortColumn?: SortColumn<Payment>;

    /** Current payment type sort column config */
    paymentTypeSortColumn?: SortColumn<PaymentType>;

    /** Last payment type list caption filter */
    typeFilterCaption?: string;
}
