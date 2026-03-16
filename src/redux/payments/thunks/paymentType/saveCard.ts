import { FieldValue } from "@bodynarf/react.components.form";

import { createAppAsyncThunk } from "@app/redux";
import { setPaymentTypes } from "@app/redux/payments";

import { getPaymentTypes, saveTypeCard as saveCardAction } from "@app/core/payment";

/**
 * Save current payment type card values
 */
export const saveTypeCard = createAppAsyncThunk(
    async ({ dispatch, showSuccess }, values: Array<FieldValue>, id?: string) => {
        await saveCardAction(values, id);
        showSuccess("Payment type successfully saved", false);

        const types = await getPaymentTypes();
        dispatch(setPaymentTypes(types));
    }
);
