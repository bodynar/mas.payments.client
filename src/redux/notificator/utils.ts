import { generateGuid } from "@bodynarf/utils";

import { ActionWithPayload } from "@app/redux";
import { getAddNotificationAction } from "@app/redux/notificator";
import { NotificationType } from "@app/models/notification";

/**
 * Get notifications module action which adding success notification
 * @param message Notification message
 * @param shouldDisplay Should display dismissible block
 * @param important Is notification important? (check same property in `NotificationItem` model)
 * @returns Notification module redux store action
 */
export const getSuccessNotificationAction = (
    message: string,
    shouldDisplay: boolean,
    important: boolean = false
): ActionWithPayload =>
    getAddNotificationAction(
        { type: NotificationType.success, message, id: generateGuid(), createdAt: new Date(), important, },
        shouldDisplay
    );

/**
 * Get notifications module action which adding warning notification
 * @param message Notification message
 * @param shouldDisplay Should display dismissible block
 * @param important Is notification important? (check same property in `NotificationItem` model)
 * @returns Notification module redux store action
 */
export const getWarningNotificationAction = (
    message: string,
    shouldDisplay: boolean,
    important: boolean = false
): ActionWithPayload =>
    getAddNotificationAction(
        { type: NotificationType.warn, message, id: generateGuid(), createdAt: new Date(), important, },
        shouldDisplay
    );

/**
 * Get notifications module action which adding error notification
 * @param message Notification message
 * @param shouldDisplay Should display dismissible block
 * @param important Is notification important? (check same property in `NotificationItem` model)
 * @returns Notification module redux store action
 */
export const getErrorNotificationAction = (
    message: string,
    shouldDisplay: boolean,
    important: boolean = false
): ActionWithPayload =>
    getAddNotificationAction(
        { type: NotificationType.error, message, id: generateGuid(), createdAt: new Date(), important, },
        shouldDisplay
    );
