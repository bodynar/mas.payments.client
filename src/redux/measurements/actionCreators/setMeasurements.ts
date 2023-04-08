import { Measurement } from "@app/models/measurements";

import { ActionWithPayload } from "@app/redux";
import { SET_MEASUREMENTS } from "@app/redux/measurements";

/**
 * Get redux action "Set measurements"
 * @param measurements measurements
 * @returns Redux action to update state
 */
export const getSetMeasurementsAction = (measurements: Array<Measurement>): ActionWithPayload => ({
    type: SET_MEASUREMENTS,
    payload: { measurements },
});
