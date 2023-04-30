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

/** Function that can display notification */
type ShowNotificationFn<TMessage> = (message: TMessage, removeLoadingState?: boolean) => void;

/** Success notification show function type */
export type ShowSuccessFn = ShowNotificationFn<string>;

/** Error notification show function type */
export type ShowErrorFn = ShowNotificationFn<Error | string>;
