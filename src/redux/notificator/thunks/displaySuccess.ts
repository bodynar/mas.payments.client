import { ThunkDispatch } from "redux-thunk";

import { Action, CompositeAppState } from "@app/redux";
import { getSuccessNotificationAction } from "@app/redux/notificator";
import { getSetAppIsLoadingAction } from "@app/redux/app";

/**
 * Create dispatch-based action to display success message
 * @param dispatch Redux store dispatcher
 * @param getState Function that provides current app redux storage
 * @param removeLoadingState Turn off loading state of app
 * @returns Redux store action displaying success message
 */
export const displaySuccess = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState,
    removeLoadingState: boolean = true,
) => (success: string): void => {
    const { app } = getState();

    dispatch(
        getSuccessNotificationAction(success, app.isCurrentTabFocused)
    );

    if (removeLoadingState) {
        dispatch(getSetAppIsLoadingAction(false));
    }
};
