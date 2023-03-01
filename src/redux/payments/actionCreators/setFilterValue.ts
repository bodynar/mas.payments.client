import { PaymentFilter } from "@app/models/payments";
import { ActionWithPayload } from "@app/redux/types";

import { setFilterValue } from "../actions";

/**
 * Get redux action "Set payments filter value"
 * @param filter Filter value
 * @returns Redux action to update state
 */
export const getSetFilterValueAction = (filter?: PaymentFilter): ActionWithPayload => ({
    type: setFilterValue,
    payload: { filter },
});
