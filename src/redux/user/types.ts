import { ApplicationInfo, Setting, UserNotification } from "@app/models/user";

/** User module state */
export type UserModuleState = {
    /** Current app info */
    appInfo?: ApplicationInfo;

    /** User notifications */
    notificationHistory: Array<UserNotification>;

    /** Custom settings */
    settings: Array<Setting>;
};
