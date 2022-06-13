import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { get } from "@app/utils/delayedApi";

import { UserNotification } from "@app/models/user";

import { CompositeAppState } from "@app/redux/rootReducer";
import { ActionWithPayload } from "@app/redux/types";
import { setError } from "@app/redux/utils";

import { getSetAppIsLoadingAction } from "@app/redux/app/actions/setAppIsLoading";

import { getSetNotificationsAction } from "../actions/setNotifications";

/**
 * Get user notificationts
 * @returns Action function that can be called with redux dispatcher
 */
export const loadNotifications = (): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> =>
    (dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
        getState: () => CompositeAppState
    ): Promise<void> => {
        dispatch(getSetAppIsLoadingAction(true));

        return get<Array<UserNotification>>(`api/user/getUserNotifications`)
            .then((notifications: Array<UserNotification>) => {
                dispatch(getSetNotificationsAction(notifications));

                dispatch(getSetAppIsLoadingAction(false));
            })
            .catch(setError(dispatch, getState));
    };
