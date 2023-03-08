import { PaymentFilter } from "@app/models/payments";

import { ActionWithPayload } from "@app/redux";
import { setFilterValue } from "@app/redux/payments";

/**
 * Get redux action "Set payments filter value"
 * @param filter Filter value
 * @param applyFilter Apply filter instantly
 * @returns Redux action to update state
 */
export const getSetFilterValueAction = (filter?: PaymentFilter, applyFilter: boolean = false): ActionWithPayload => ({
    type: setFilterValue,
    payload: {
        filter,
        applyFilter
    },
});
