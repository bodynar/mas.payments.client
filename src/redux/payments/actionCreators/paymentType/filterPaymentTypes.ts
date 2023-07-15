import { ActionWithPayload } from "@app/redux";
import { FILTER_PAYMENT_TYPES } from "@app/redux/payments";

/**
 * Get redux action "Filter payment types"
 * @param sortColumn Sort column
 * @returns Redux action to update state
 */
export const getFilterPaymentTypesAction = (nameFilterValue?: string): ActionWithPayload => ({
    type: FILTER_PAYMENT_TYPES,
    payload: {
        name: nameFilterValue
    },
});
