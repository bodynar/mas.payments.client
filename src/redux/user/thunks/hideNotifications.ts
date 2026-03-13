import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { post } from "@app/utils";

import { getUserNotifications } from "@app/core/user";

import { CompositeAppState, Action } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { setNotifications } from "@app/redux/user";
import { hideNotifications as hideNotificationsAction, getNotifications } from "@app/redux/notificator";

/**
 * Get "Hide important notifications" redux action thunk
 * @param ids Identifiers of notifications to hide. To hide all - pass empty array.
 * @returns Action function that can be called with redux dispatcher
 */
export const hideNotifications = (ids: Array<string>): ThunkAction<void, CompositeAppState, unknown, Action> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState,
): void => {
    const { notificator } = getState();

    ids = ids.length > 0 ? ids : notificator.notifications.map(({ id }) => id);

    const notifications = notificator.notifications.filter(({ important, id }) => important && ids.includes(id));

    if (notifications.length === 0) {
        dispatch(hideNotificationsAction(ids));
        return;
    }

    dispatch(setAppIsLoading(true));

    const [_, displayError] = getNotifications(dispatch, getState);

    post<Array<number>>(`api/user/hideNotifications`,
        notifications.map(({ entityId }) => entityId)
    )
        .then(notHiddenIds => {
            getUserNotifications()
                .then(loadedNotifications => {
                    if (notHiddenIds.length > 0) {
                        const notHiddenNotifications =
                            notifications
                                .filter(({ entityId }) => notHiddenIds.includes(entityId!))
                                .map(({ id }) => id);

                        ids = ids.filter(x => !notHiddenNotifications.includes(x));

                        displayError(
                            "Not all notifications were hidden. Please, contact system administrator", true
                        );
                    }

                    dispatch(setNotifications(loadedNotifications));
                    dispatch(hideNotificationsAction(ids));
                    dispatch(setAppIsLoading(false));
                });
        })
        .catch(displayError);
};
