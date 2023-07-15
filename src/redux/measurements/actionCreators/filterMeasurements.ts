import { Action } from "@app/redux";
import { FILTER_MEASUREMENTS } from "@app/redux/measurements";

/**
 * Get redux action "Filter measurements"
 * @returns Redux action to update state
 */
export const getFilterMeasurementsAction = (): Action => ({
    type: FILTER_MEASUREMENTS
});
