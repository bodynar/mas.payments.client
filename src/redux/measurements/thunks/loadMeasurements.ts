import { createAppAsyncThunk } from "@app/redux";
import { setMeasurements } from "@app/redux/measurements";

import { getMeasurements } from "@app/core/measurement";

/**
 * Load all measurements
 */
export const loadMeasurements = createAppAsyncThunk(
    async ({ dispatch }) => {
        const measurements = await getMeasurements();
        dispatch(setMeasurements(measurements));
    }
);
