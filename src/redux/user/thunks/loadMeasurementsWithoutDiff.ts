import { get } from "@app/utils";

import { createAppAsyncThunk } from "@app/redux";
import { setMeasurementsWithoutDiff } from "@app/redux/user";

/**
 * Get measurements without diff count
 */
export const getMeasurementsWithoutDiff = createAppAsyncThunk(
    async ({ dispatch }) => {
        const count = await get<number>(`api/measurement/withoutDiff`);
        dispatch(setMeasurementsWithoutDiff(count));
    }
);
