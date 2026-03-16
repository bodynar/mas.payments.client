import { FieldValue } from "@bodynarf/react.components.form";

import { createAppAsyncThunk } from "@app/redux";
import { setPayments } from "@app/redux/payments";

import { getPaymentRecords, saveCard as saveCardAction } from "@app/core/payment";

/**
 * Save current card values
 */
export const saveCard = createAppAsyncThunk(
    async ({ dispatch, showSuccess }, values: Array<FieldValue>, id?: string) => {
        await saveCardAction(values, id);
        showSuccess("Payment record successfully saved", false);

        const payments = await getPaymentRecords();
        dispatch(setPayments(payments));
    }
);
