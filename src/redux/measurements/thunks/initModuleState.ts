import { createAppAsyncThunk } from "@app/redux";
import { setMeasurementTypes, setModuleInitializedState, setMeasurements } from "@app/redux/measurements";
import { setPaymentTypes } from "@app/redux/payments";

import { getMeasurements, getMeasurementTypes } from "@app/core/measurement";
import { getPaymentTypes } from "@app/core/payment";

/**
 * Init measurements module state
 */
export const initModuleState = createAppAsyncThunk(
    async ({ dispatch }) => {
        const [types, measurements, paymentTypes] = await Promise.all([
            getMeasurementTypes(),
            getMeasurements(),
            getPaymentTypes(),
        ]);

        dispatch(setMeasurementTypes(types));
        dispatch(setMeasurements(measurements));
        dispatch(setPaymentTypes(paymentTypes));
        dispatch(setModuleInitializedState(true));
    }
);
