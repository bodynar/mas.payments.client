import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { UserNotification } from "@app/models/user";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetNotificationsAction } from "@app/redux/user";
import { getNotifications, getWarningNotificationAction } from "@app/redux/notificator";
import { getUserNotifications } from "@app/core/user";

/**
 * Get user notifications
 * @returns Action function that can be called with redux dispatcher
 */
export const loadNotifications = (): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState,
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));

    const { notificator } = getState();

    const [_, displayError] = getNotifications(dispatch, getState);

    return getUserNotifications()
        .then((notifications: Array<UserNotification>) => {
            dispatch(getSetNotificationsAction(notifications));

            notifications
                .filter(({ isHidden, id }) =>
                    !isHidden && !notificator.notifications.some(x => x.entityId === id)
                )
                .forEach(({ text, id }) =>
                    dispatch(
                        getWarningNotificationAction(
                            text, false, true, id
                        )
                    )
                );

            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(displayError);
};
