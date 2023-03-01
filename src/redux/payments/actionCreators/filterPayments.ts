import { Action } from "@app/redux";
import { filterPayments } from "@app/redux/payments";

/**
 * Get redux action "Filter payments"
 * @returns Redux action to update state
 */
export const getFilterPaymentsAction = (): Action => ({
    type: filterPayments
});
