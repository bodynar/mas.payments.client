import { Payment } from "@app/models/payments";
import { ActionWithPayload } from "@app/redux/types";

import { setPayments } from "../actions";

/**
 * Get redux action "Set payments"
 * @param payments Payments
 * @returns Redux action to update state
 */
export const getSetPaymentsAction = (payments: Array<Payment>): ActionWithPayload => ({
    type: setPayments,
    payload: { payments },
});
