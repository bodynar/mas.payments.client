import { ActionWithPayload } from "@app/redux/types";

import { setModuleInitializedState } from "../actions";

/**
 * Get redux action "Set module initialized state"
 * @param isInitialized Is module initialized
 * @returns Redux action to update state
 */
export const getSetModuleInitializedStateAction = (isInitialized: boolean): ActionWithPayload => ({
    type: setModuleInitializedState,
    payload: { isInitialized },
});
