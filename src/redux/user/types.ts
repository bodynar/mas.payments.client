import { ApplicationInfo, UserSetting, UserNotification } from "@app/models/user";

/** User module state */
export type UserModuleState = {
    /** Current app info */
    appInfo?: ApplicationInfo;

    /** User notifications */
    notificationHistory: Array<UserNotification>;

    /** Is notifications sorted ascendely by CreatedAt field */
    isNotificationSortOrderAsc: boolean;

    /** Custom settings */
    settings: Array<UserSetting>;
};
