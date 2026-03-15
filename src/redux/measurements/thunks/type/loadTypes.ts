import { createAppAsyncThunk } from "@app/redux";
import { setMeasurementTypes } from "@app/redux/measurements";

import { getMeasurementTypes } from "@app/core/measurement";

/**
 * Load available measurement types
 */
export const loadTypes = createAppAsyncThunk(
    async ({ dispatch, getState }) => {
        const { measurements } = getState();

        const types = measurements.typesMap.size > 0
            ? [...measurements.typesMap.values()]
            : await getMeasurementTypes();

        dispatch(setMeasurementTypes(types));
    }
);
