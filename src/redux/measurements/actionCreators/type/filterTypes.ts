import { ActionWithPayload } from "@app/redux";
import { FILTER_MEASUREMENT_TYPES } from "@app/redux/measurements";

/**
 * Get redux action "Filter measurements types"
 * @param sortColumn Sort column
 * @returns Redux action to update state
 */
export const getFilterMeasurementsTypesAction = (nameFilterValue?: string): ActionWithPayload => ({
    type: FILTER_MEASUREMENT_TYPES,
    payload: {
        name: nameFilterValue
    },
});
