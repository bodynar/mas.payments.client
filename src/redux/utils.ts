import { ThunkDispatch } from "redux-thunk";

import { getSetAppIsLoadingAction } from "./app/actions/setAppIsLoading";

import { getErrorNotificationAction, getSuccessNotificationAction } from "./notificator/utils";
import { CompositeAppState } from "./rootReducer";
import { Action } from "./types";

/**
 * Create dispatch-based action to display error message
 * @param dispatch Redux store dispatcher
 * @returns Redux store action displaying error message
 */
export const getDisplayErrorMessageAction = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState
) => (error: string): void => {
    const { app } = getState();

    dispatch(getErrorNotificationAction(error, app.isCurrentTabFocused));

    dispatch(getSetAppIsLoadingAction(false));
};

/**
 * Create dispatch-based action to display success message
 * @param dispatch Redux store dispatcher
 * @returns Redux store action displaying success message
 */
 export const getDisplaySuccessMessageAction = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState
) => (success: string): void => {
    const { app } = getState();

    dispatch(getSuccessNotificationAction(success, app.isCurrentTabFocused));

    dispatch(getSetAppIsLoadingAction(false));
};
