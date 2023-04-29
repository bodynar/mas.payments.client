import { ThunkAction, ThunkDispatch } from "redux-thunk";

import moment from "moment";

import { isNullOrUndefined } from "@bodynarf/utils";

import { get } from "@app/utils";

import { UserNotification } from "@app/models/user";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetNotificationsAction } from "@app/redux/user";
import { displayError } from "@app/redux/notificator";

/**
 * Get user notificationts
 * @returns Action function that can be called with redux dispatcher
 */
export const loadNotifications = (): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState,
): Promise<void> => { // TODO: promise?
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
        .catch(displayError(dispatch, getState));
};
