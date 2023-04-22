import { ThunkDispatch } from "redux-thunk";

import { Action, CompositeAppState } from "@app/redux";
import { getErrorNotificationAction, getSuccessNotificationAction } from "@app/redux/notificator";
import { getSetAppIsLoadingAction } from "@app/redux/app";

/**
 * Create dispatch-based action to display error message
 * @param dispatch Redux store dispatcher
 * @param getState Function that provides current app redux storage
 * @param removeLoadingState Turn off loading state of app
 * @returns Redux store action displaying error message
 */
export const getDisplayErrorMessageAction = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState,
    removeLoadingState: boolean = true,
) => (error: Error | string): void => {
    const { app } = getState();

    const errorMessage = (error as Error)?.message ?? (error as string);

    dispatch(getErrorNotificationAction(errorMessage, app.isCurrentTabFocused));

    if (removeLoadingState) {
        dispatch(getSetAppIsLoadingAction(false));
    }
};

/**
 * Create dispatch-based action to display success message
 * @param dispatch Redux store dispatcher
 * @param getState Function that provides current app redux storage
 * @param removeLoadingState Turn off loading state of app
 * @returns Redux store action displaying success message
 */
export const getDisplaySuccessMessageAction = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState,
    removeLoadingState: boolean = true,
) => (success: string): void => {
    const { app } = getState();

    dispatch(getSuccessNotificationAction(success, app.isCurrentTabFocused));

    if (removeLoadingState) {
        dispatch(getSetAppIsLoadingAction(false));
    }
};
