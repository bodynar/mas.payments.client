import { createAppAsyncThunk } from "@app/redux";
import { setPaymentTypes, setModuleInitializedState, setPayments } from "@app/redux/payments";

import { getPaymentRecords, getPaymentTypes } from "@app/core/payment";

/**
 * Init payments module state
 */
export const initModuleState = createAppAsyncThunk(
    async ({ dispatch, getState }) => {
        const { payments } = getState();

        const typesPromise =
            payments.typesMap.size > 0
                ? Promise.resolve([...payments.typesMap.values()])
                : getPaymentTypes();

        const [types, records] = await Promise.all([typesPromise, getPaymentRecords()]);

        dispatch(setPaymentTypes(types));
        dispatch(setPayments(records));
        dispatch(setModuleInitializedState(true));
    }
);
