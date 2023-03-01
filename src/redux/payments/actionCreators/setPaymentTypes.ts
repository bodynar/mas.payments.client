import { PaymentType } from "@app/models/payments";

import { ActionWithPayload } from "@app/redux/types";
import { setPaymentTypes } from "@app/redux/payments";

/**
 * Get redux action "Set payment types"
 * @param types Payment types
 * @returns Redux action to update state
 */
export const getSetPaymentTypesAction = (types: Array<PaymentType>): ActionWithPayload => ({
    type: setPaymentTypes,
    payload: { types },
});
