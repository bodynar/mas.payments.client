import { Payment } from "@app/models/payments";
import { SortColumn } from "@app/models";

import { ActionWithPayload } from "@app/redux";
import { SET_PAYMENT_SORT_COLUMN } from "@app/redux/payments";

/**
 * Get redux action "Set payment sort column"
 * @param sortColumn Sort column
 * @returns Redux action to update state
 */
export const getSetSortColumnAction = (sortColumn: SortColumn<Payment>): ActionWithPayload => ({
    type: SET_PAYMENT_SORT_COLUMN,
    payload: { sortColumn },
});
