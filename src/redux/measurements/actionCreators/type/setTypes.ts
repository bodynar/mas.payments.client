import { MeasurementType } from "@app/models/measurements";

import { ActionWithPayload } from "@app/redux/types";
import { SET_MEASUREMENT_TYPES } from "@app/redux/measurements";

/**
 * Get redux action "Set measurement types"
 * @param types Measurement types
 * @returns Redux action to update state
 */
export const getSetMeasurementTypesAction = (types: Array<MeasurementType>): ActionWithPayload => ({
    type: SET_MEASUREMENT_TYPES,
    payload: { types },
});
