import { getUserNotifications } from "@app/core/user";

import { createAppAsyncThunk } from "@app/redux";
import { setNotifications } from "@app/redux/user";
import { getWarningNotificationAction } from "@app/redux/notificator";

/**
 * Get user notifications
 */
export const loadNotifications = createAppAsyncThunk(
    async ({ dispatch, getState }) => {
        const { notificator } = getState();
        const notifications = await getUserNotifications();

        dispatch(setNotifications(notifications));

        notifications
            .filter(({ isHidden, id }) =>
                !isHidden && (id == null || !notificator.notifications.some(x => x.entityId === id))
            )
            .forEach(({ text, id }) =>
                dispatch(getWarningNotificationAction(text, false, true, id ?? undefined))
            );
    }
);
