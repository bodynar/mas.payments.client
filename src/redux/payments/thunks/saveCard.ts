import { isNotNullish } from "@bodynarf/utils";

import { createAppAsyncThunk } from "@app/redux";
import { setPayments } from "@app/redux/payments";

import { getPaymentRecords, saveCard as saveCardAction, uploadPaymentFile } from "@app/core/payment";
import { SavePaymentData } from "@app/models/payments";

/**
 * Save current card values.
 * If `file` is provided and the payment already has an `id` (edit mode),
 * the file is uploaded and attached to the payment after the record is saved.
 */
export const saveCard = createAppAsyncThunk(
    async ({ dispatch, showSuccess }, data: SavePaymentData, id?: string, file?: File): Promise<boolean> => {
        await saveCardAction(data, id);

        if (isNotNullish(file) && isNotNullish(id)) {
            await uploadPaymentFile(file, id);
        }

        showSuccess("Payment record successfully saved", false);

        const payments = await getPaymentRecords();
        dispatch(setPayments(payments));

        return true;
    }
);
