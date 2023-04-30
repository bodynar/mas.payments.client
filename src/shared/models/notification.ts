/** Notification types */
export enum NotificationType {
    /** Blue color */
    "info",

    /** Green color */
    "success",

    /** Orange color */
    "warn",

    /** Red color */
    "error",
}

/** Notification model */
export interface NotificationItem extends NotificationHistoryItem {
    /** Optional delay in seconds */
    delay?: number;

    /** Should notification be light-colored */
    isLightColor?: boolean;
}

export interface NotificationHistoryItem {
    /** Unique identifier, automaticly generated */
    id: string;

    /** Type  */
    type: NotificationType;

    /** Displaying message */
    message: string;

    /** Date of creation */
    createdAt: Date;
}
