/** Notification types */
export enum NotificationType {
    /** Blue color */
    info = "info",

    /** Green color */
    success = "success",

    /** Orange color */
    warn = "warn",

    /** Red color */
    error = "error",
}

/** Notification model */
export interface NotificationItem extends NotificationHistoryItem {
    /** Optional delay in seconds */
    delay?: number;

    /** Should notification be light-colored */
    isLightColor?: boolean;

    /**
     * If notification marked as important - it won't be hidden after few seconds.
     * After manual hide - it will be updated on server
    */
    important: boolean;

    /** Unique entity identifier */
    entityId?: string;
}

export interface NotificationHistoryItem {
    /** Unique identifier, automatically generated */
    id: string;

    /** Type  */
    type: NotificationType;

    /** Displaying message */
    message: string;

    /** Date of creation */
    createdAt: Date;
}
