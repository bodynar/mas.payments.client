import { ThunkDispatch } from "redux-thunk";

import { Action, CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { ShowSuccessFn, getSuccessNotificationAction } from "@app/redux/notificator";

/**
 * Create dispatch-based action to display success message
 * @param dispatch Redux store dispatcher
 * @param getState Function that provides current app redux storage
 * @returns Redux store action displaying success message
 */
export const displaySuccess = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState,
): ShowSuccessFn => {
    return (message: string, removeLoadingState: boolean = true, important: boolean = false) => {
        const { app } = getState();

        dispatch(
            getSuccessNotificationAction(message, app.isCurrentTabFocused, important)
        );

        if (removeLoadingState) {
            dispatch(getSetAppIsLoadingAction(false));
        }
    };
};
