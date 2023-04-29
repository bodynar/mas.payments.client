import { ActionWithPayload } from "@app/redux";
import { SET_IS_APP_IN_LOADING_STATE } from "@app/redux/app";

/**
 * Get redux action "Set app is in loading state"
 * @param loading Is app in loading state 
 * @returns Redux action to update state
 */
export const getSetAppIsLoadingAction = (loading: boolean): ActionWithPayload => ({
    type: SET_IS_APP_IN_LOADING_STATE,
    payload: { loading },
});

