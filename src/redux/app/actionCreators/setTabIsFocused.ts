import { ActionWithPayload } from "@app/redux/types";

import { SetTabIsFocused } from "../actions";

/**
 * Get redux action "Set tab is focused"
 * @param isTabFocused Is tab currently in focus
 * @returns Redux action to update state
 */
export const getSetTabIsFocusedAction = (isTabFocused: boolean): ActionWithPayload => ({
    type: SetTabIsFocused,
    payload: {
        isTabFocused
    }
});

