import { createAppAsyncThunk } from "@app/redux";
import { setMeasurementsWithoutDiff } from "@app/redux/user";

import { getMeasurementsWithoutDiffCount } from "@app/core/measurement";

/**
 * Get measurements without diff count
 */
export const getMeasurementsWithoutDiff = createAppAsyncThunk(
    async ({ dispatch }) => {
        const count = await getMeasurementsWithoutDiffCount();
        dispatch(setMeasurementsWithoutDiff(count));
    }
);
