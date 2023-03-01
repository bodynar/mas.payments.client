import { Payment } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

import { ActionWithPayload } from "@app/redux";
import { setSortColumn } from "@app/redux/payments";

/**
 * Get redux action "Set sort column"
 * @param sortColumn Sort column
 * @returns Redux action to update state
 */
export const getSetSortColumnAction = (sortColumn: SortColumn<Payment>): ActionWithPayload => ({
    type: setSortColumn,
    payload: { sortColumn },
});
