import { createAppAsyncThunk } from "@app/redux";
import { setPayments } from "@app/redux/payments";

import { getPaymentRecords } from "@app/core/payment";

/**
 * Load all payments
 */
export const loadPayments = createAppAsyncThunk(
    async ({ dispatch }) => {
        const payments = await getPaymentRecords();
        dispatch(setPayments(payments));
    }
);
