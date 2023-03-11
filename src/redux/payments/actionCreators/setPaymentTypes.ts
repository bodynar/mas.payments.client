import { PaymentType } from "@app/models/payments";

import { ActionWithPayload } from "@app/redux/types";
import { SET_PAYMENT_TYPES } from "@app/redux/payments";

/**
 * Get redux action "Set payment types"
 * @param types Payment types
 * @returns Redux action to update state
 */
export const getSetPaymentTypesAction = (types: Array<PaymentType>): ActionWithPayload => ({
    type: SET_PAYMENT_TYPES,
    payload: { types },
});
