/** Notification types */
export type NotificationType =
    | 'info' /** Blue color */
    | 'success' /** Green color */
    | 'warn' /** Orange color */
    | 'error' /** Red color */
    ;

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
