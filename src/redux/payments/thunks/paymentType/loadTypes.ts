import { createAppAsyncThunk } from "@app/redux";
import { setPaymentTypes } from "@app/redux/payments";

import { getPaymentTypes } from "@app/core/payment";

/**
 * Load available payment types
 */
export const loadTypes = createAppAsyncThunk(
    async ({ dispatch, getState }) => {
        const { payments } = getState();

        const types = payments.typesMap.size > 0
            ? [...payments.typesMap.values()]
            : await getPaymentTypes();

        dispatch(setPaymentTypes(types));
    }
);
