import moment from "moment";

import { isNullOrUndefined } from "@bodynarf/utils";

import { get } from "@app/utils";
import { UserNotification } from "@app/models/user";

/**
 * Get user notifications with all types
 * @returns Promise with all loaded user notifications
 */
export const getUserNotifications = async (): Promise<Array<UserNotification>> => {
    const notifications = await get<Array<UserNotification>>(`api/user/getUserNotifications`);

    return notifications.map(x => ({
        ...x,
        createdAt: new Date(x.createdAt),
        hiddenAt: isNullOrUndefined(x.hiddenAt) ? undefined : new Date(x.hiddenAt!)
    })).map(x => ({
        ...x,
        createdAtMoment: moment(x.createdAt),
        hiddenAtMoment: isNullOrUndefined(x.hiddenAt) ? undefined : moment(x.hiddenAt!)
    }));
};
