import { ActionWithPayload } from "@app/redux";
import { SetIsAppLoadingState } from "@app/redux/app";

/**
 * Get redux action "Set app is in loading state"
 * @param loading Is app in loading state 
 * @returns Redux action to update state
 */
export const getSetAppIsLoadingAction = (loading: boolean): ActionWithPayload => ({
    type: SetIsAppLoadingState,
    payload: { loading },
});

