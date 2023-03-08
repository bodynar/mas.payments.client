import { PaymentType } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

import { ActionWithPayload } from "@app/redux";
import { setTypeSortColumn } from "@app/redux/payments";

/**
 * Get redux action "Set payment type sort column"
 * @param sortColumn Sort column
 * @returns Redux action to update state
 */
export const getSetTypeSortColumnAction = (sortColumn: SortColumn<PaymentType>): ActionWithPayload => ({
    type: setTypeSortColumn,
    payload: { sortColumn },
});
