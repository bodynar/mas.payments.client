import { isNotNullish } from "@bodynarf/utils";

import { createAppAsyncThunk } from "@app/redux";
import { setPayments } from "@app/redux/payments";

import { getPaymentRecords, saveCard as saveCardAction, uploadPaymentFile } from "@app/core/payment";
import { SavePaymentData } from "@app/models/payments";

/**
 * Save current card values.
 * If `file` is provided the file is uploaded and attached to the payment after the record is saved.
 * When creating (id is undefined) the new id returned by the API is used for the upload.
 */
export const saveCard = createAppAsyncThunk(
    async ({ dispatch, showSuccess }, data: SavePaymentData, id?: string, file?: File): Promise<boolean> => {
        const newId = await saveCardAction(data, id);

        if (isNotNullish(file)) {
            const paymentId = id ?? newId;
            if (isNotNullish(paymentId)) {
                await uploadPaymentFile(file, paymentId);
            }
        }

        showSuccess("Payment record successfully saved", false);

        const payments = await getPaymentRecords();
        dispatch(setPayments(payments));

        return true;
    }
);
