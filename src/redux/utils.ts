import { ThunkDispatch } from "redux-thunk";

import { Action, CompositeAppState } from "@app/redux";
import { getErrorNotificationAction, getSuccessNotificationAction } from "@app/redux/notificator";

/**
 * Create dispatch-based action to display error message
 * @param dispatch Redux store dispatcher
 * @returns Redux store action displaying error message
 */
export const getDisplayErrorMessageAction = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState
) => (error: Error | string): void => {
    const { app } = getState();

    const errorMessage = (error as Error)?.message ?? (error as string);

    dispatch(getErrorNotificationAction(errorMessage, app.isCurrentTabFocused));
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
};
