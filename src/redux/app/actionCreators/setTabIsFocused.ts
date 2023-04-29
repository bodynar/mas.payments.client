import { ActionWithPayload } from "@app/redux";
import { SET_TAB_IS_FOCUSED } from "@app/redux/app";

/**
 * Get redux action "Set tab is focused"
 * @param isTabFocused Is tab currently in focus
 * @returns Redux action to update state
 */
export const getSetTabIsFocusedAction = (isTabFocused: boolean): ActionWithPayload => ({
    type: SET_TAB_IS_FOCUSED,
    payload: {
        isTabFocused
    }
});

