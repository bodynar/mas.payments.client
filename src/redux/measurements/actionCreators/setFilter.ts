import { MeasurementFilter } from "@app/models/measurements";

import { ActionWithPayload } from "@app/redux";
import { SET_MEASUREMENT_FILTER_VALUE } from "@app/redux/measurements";

/**
 * Get redux action "Set measurement filter value"
 * @param filter Filter value
 * @param applyFilter Apply filter instantly
 * @returns Redux action to update state
 */
export const getSetFilterValueAction = (filter?: MeasurementFilter, applyFilter: boolean = false): ActionWithPayload => ({
    type: SET_MEASUREMENT_FILTER_VALUE,
    payload: {
        filter,
        applyFilter
    },
});
