import { ThunkDispatch } from "redux-thunk";

import { getErrorNotificationAction } from "../notificator/utils";
import { CompositeAppState } from "../rootReducer";
import { Action } from "../types";

import { getSetAppIsLoadingAction } from "./actions/setAppIsLoading";

/**
 * Create dispatch-based action to set app error state
 * @param dispatch Redux store dispatcher
 * @returns Redux store action setting error
 */
export const setError = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState
) => (error: string): void => {
    const { app } = getState();

    dispatch(getErrorNotificationAction(error, app.isCurrentTabFocused));

    dispatch(getSetAppIsLoadingAction(false));
};
