import { NotificationHistoryItem, NotificationItem } from "@app/models/notification";

/** State of notification module */
export interface NotificatorState {
    /** Active notifications */
    notifications: Array<NotificationItem>;

    /** Stack of all notifications */
    history: Array<NotificationHistoryItem>;

    /** Number on history badge */
    historyBadgeCount: number;
}
