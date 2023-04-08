import { MeasurementGroupedByType } from "@app/models/measurements";

import { ActionWithPayload } from "@app/redux";
import { SET_GROUPED_BY_TYPE } from "@app/redux/measurements";

/**
 * Get redux action "Set measurements grouped by type"
 * @param groups Grouped items
 * @returns Redux action to update state
 */
export const getSetGroupedByTypeAction = (groups: Array<MeasurementGroupedByType>): ActionWithPayload => ({
    type: SET_GROUPED_BY_TYPE,
    payload: { groups },
});
