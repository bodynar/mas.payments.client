import { ThunkDispatch } from "redux-thunk";

import { Action, CompositeAppState } from "@app/redux";
import { ShowErrorFn, ShowSuccessFn } from "@app/redux/notificator";

import { displaySuccess } from "./displaySuccess";
import { displayError } from "./displayError";

/**
 * Get success or error notification 
 * @param dispatch Redux store dispatcher
 * @param getState Function that provides current redux store
 * @returns Pair of functions that can display notifications in success or error state
 */
export const getNotifications = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState,
): [ShowSuccessFn, ShowErrorFn] => {
    return [
        displaySuccess(dispatch, getState),
        displayError(dispatch, getState),
    ];
};
