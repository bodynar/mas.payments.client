import { Action } from "@app/redux";
import { TOGGLE_GROUP_VIEW } from "@app/redux/payments";

/**
 * Get redux action "Toggle group view"
 * @param sortColumn Sort column
 * @returns Redux action to update state
 */
export const getToggleGroupViewAction = (): Action => ({
    type: TOGGLE_GROUP_VIEW,
});
