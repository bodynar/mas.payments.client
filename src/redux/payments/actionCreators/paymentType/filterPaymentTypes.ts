import { ActionWithPayload } from "@app/redux";
import { filterPaymentTypes } from "@app/redux/payments";

/**
 * Get redux action "Filter payment types"
 * @param sortColumn Sort column
 * @returns Redux action to update state
 */
export const getFilterPaymentTypesAction = (nameFilterValue?: string): ActionWithPayload => ({
    type: filterPaymentTypes,
    payload: {
        name: nameFilterValue
    },
});
