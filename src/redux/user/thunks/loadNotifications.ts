import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { get } from "@app/utils/delayedApi";

import { UserNotification } from "@app/models/user";

import { CompositeAppState } from "@app/redux/rootReducer";
import { ActionWithPayload } from "@app/redux/types";
import { getDisplayErrorMessageAction } from "@app/redux/utils";

import { getSetAppIsLoadingAction } from "@app/redux/app/actions/setAppIsLoading";

import { getSetNotificationsAction } from "../actions/setNotifications";
import { isNullOrUndefined } from "@bodynarf/utils";
import moment from "moment";

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
                dispatch(
                    getSetNotificationsAction(
                        notifications.map(x => ({
                            ...x,
                            createdAt: new Date(x.createdAt),
                            hiddenAt: isNullOrUndefined(x.hiddenAt) ? undefined : new Date(x.hiddenAt!)
                        })).map(x => ({
                            ...x,
                            createdAtMoment: moment(x.createdAt),
                            hiddenAtMoment: isNullOrUndefined(x.hiddenAt) ? undefined : moment(x.hiddenAt!)
                        }))
                    )
                );

                dispatch(getSetAppIsLoadingAction(false));
            })
            .catch(getDisplayErrorMessageAction(dispatch, getState));
    };
