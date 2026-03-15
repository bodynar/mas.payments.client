import { getUserNotifications, hideUserNotifications } from "@app/core/user";

import { createAppAsyncThunk } from "@app/redux";
import { setNotifications } from "@app/redux/user";
import { hideNotifications as hideNotificationsAction } from "@app/redux/notificator";

/**
 * Hide important notifications
 * @param ids Identifiers of notifications to hide. To hide all - pass empty array.
 */
export const hideNotifications = createAppAsyncThunk(
    async ({ dispatch, getState, showError }, ids: Array<string>) => {
        const { notificator } = getState();

        ids = ids.length > 0 ? ids : notificator.notifications.map(({ id }) => id);

        const notifications = notificator.notifications.filter(({ important, id }) => important && ids.includes(id));

        if (notifications.length === 0) {
            dispatch(hideNotificationsAction(ids));
            return;
        }

        const notHiddenIds = await hideUserNotifications(
            notifications.map(({ entityId }) => entityId)
        );

        const loadedNotifications = await getUserNotifications();

        if (notHiddenIds.length > 0) {
            const notHiddenNotifications =
                notifications
                    .filter(({ entityId }) => notHiddenIds.includes(entityId!))
                    .map(({ id }) => id);

            ids = ids.filter(x => !notHiddenNotifications.includes(x));

            showError(
                "Not all notifications were hidden. Please, contact system administrator", true
            );
        }

        dispatch(setNotifications(loadedNotifications));
        dispatch(hideNotificationsAction(ids));
    }
);
