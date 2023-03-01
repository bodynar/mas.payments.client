import { Payment } from "@app/models/payments";

import { ActionWithPayload } from "@app/redux";
import { setPayments } from "@app/redux/payments";

/**
 * Get redux action "Set payments"
 * @param payments Payments
 * @returns Redux action to update state
 */
export const getSetPaymentsAction = (payments: Array<Payment>): ActionWithPayload => ({
    type: setPayments,
    payload: { payments },
});
