import { Action } from "@app/redux";
import { FILTER_PAYMENTS } from "@app/redux/payments";

/**
 * Get redux action "Filter payments"
 * @returns Redux action to update state
 */
export const getFilterPaymentsAction = (): Action => ({
    type: FILTER_PAYMENTS
});
