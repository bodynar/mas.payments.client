import { generateGuid } from "@bodynarf/utils";

import { addNotifications } from "@app/redux/notificator";
import { NotificationType } from "@app/models/notification";
import { UnknownAction } from "@reduxjs/toolkit";

/**
 * Get notifications module action which adding success notification
 * @param message Notification message
 * @param shouldDisplay Should notification appear on bell as badge
 * @param important Is notification important? (check same property in `NotificationItem` model)
 * @param entityId Entity identifier to store relation to concrete entity
 * @returns Notification module redux store action
 */
export const getSuccessNotificationAction = (
    message: string,
    shouldDisplay: boolean,
    important: boolean = false,
    entityId?: string,
): UnknownAction =>
    addNotifications({
        notifications: [{ type: NotificationType.success, message, id: generateGuid(), createdAt: new Date(), important, entityId, }],
        displayDismissibleNotification: shouldDisplay
    });

/**
 * Get notifications module action which adding warning notification
 * @param message Notification message
 * @param shouldDisplay Should notification appear on bell as badge
 * @param important Is notification important? (check same property in `NotificationItem` model)
 * @param entityId Entity identifier to store relation to concrete entity
 * @returns Notification module redux store action
 */
export const getWarningNotificationAction = (
    message: string,
    shouldDisplay: boolean,
    important: boolean = false,
    entityId?: string,
): UnknownAction =>
    addNotifications({
        notifications: [{ type: NotificationType.warn, message, id: generateGuid(), createdAt: new Date(), important, entityId, }],
        displayDismissibleNotification: shouldDisplay
    });

/**
 * Get notifications module action which adding error notification
 * @param message Notification message
 * @param shouldDisplay Should notification appear on bell as badge
 * @param important Is notification important? (check same property in `NotificationItem` model)
 * @param entityId Entity identifier to store relation to concrete entity
 * @returns Notification module redux store action
 */
export const getErrorNotificationAction = (
    message: string,
    shouldDisplay: boolean,
    important: boolean = false,
    entityId?: string,
): UnknownAction =>
    addNotifications({
        notifications: [{ type: NotificationType.error, message, id: generateGuid(), createdAt: new Date(), important, entityId, }],
        displayDismissibleNotification: shouldDisplay
    });
