import { Action } from "@app/redux/types";

import { filterPayments } from "../actions";

/**
 * Get redux action "Filter payments"
 * @returns Redux action to update state
 */
export const getFilterPaymentsAction = (): Action => ({
    type: filterPayments
});
