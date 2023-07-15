import { ActionWithPayload } from "@app/redux";
import { SET_MODULE_INITIALIZED_STATE } from "@app/redux/measurements";

/**
 * Get redux action "Set measurement module initialized state"
 * @param isInitialized Is module initialized
 * @returns Redux action to update state
 */
export const getSetModuleInitializedStateAction = (isInitialized: boolean): ActionWithPayload => ({
    type: SET_MODULE_INITIALIZED_STATE,
    payload: { isInitialized },
});
