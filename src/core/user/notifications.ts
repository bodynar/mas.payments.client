import { isNullish } from "@bodynarf/utils";

import { get, post } from "@app/utils";
import { UserNotification } from "@app/models/user";

/**
 * Get user notifications with all types
 * @returns Promise with all loaded user notifications
 */
export const getUserNotifications = async (): Promise<Array<UserNotification>> => {
    const notifications = await get<Array<UserNotification>>(`api/user/getUserNotifications`);

    return notifications.map(x => ({
        ...x,
        createdAt: x.createdAt != null ? new Date(x.createdAt) : null,
        hiddenAt: isNullish(x.hiddenAt) ? undefined : new Date(x.hiddenAt!),
    }));
};

/**
 * Hide user notifications by their entity ids
 * @param entityIds Array of notification entity identifiers
 * @returns Promise with array of entity ids that were NOT hidden
 */
export const hideUserNotifications = async (entityIds: Array<string>): Promise<Array<string>> => {
    return post<Array<string>>("api/user/hideNotifications", entityIds);
};
