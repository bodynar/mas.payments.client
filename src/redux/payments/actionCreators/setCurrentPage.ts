import { ActionWithPayload } from "@app/redux";
import { SET_CURRENT_PAGE } from "@app/redux/payments";

/**
 * Get redux action "Set current page"
 * @param page Current page number
 * @returns Redux action to update state
 */
export const getSetCurrentPageAction = (page: number): ActionWithPayload => ({
    type: SET_CURRENT_PAGE,
    payload: { page },
});
