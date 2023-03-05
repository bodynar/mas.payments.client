import moment from "moment";

import "./notificationStoryRecord.scss";

import { NotificationHistoryItem, NotificationType } from "@app/models/notification";

interface NotificationStoryRecordProps {
    /** Notification item for displaying */
    item: NotificationHistoryItem;
}

/** Map of notification type to color */
const typeColorMap: Map<NotificationType, string> = new Map([
    ["info", "#3298dc"],
    ["success", "#48c774"],
    ["warn", "#ffd83d"],
    ["error", "#f14668"],
]);

/** Notification item in history list component */
export default function NotificationStoryRecord({ item }: NotificationStoryRecordProps): JSX.Element {
    const createdAt: string = moment(item.createdAt).format("DD MMMM HH:mm");

    return (
        <li className="notification-story-item">
            <div className="notification-story-item__description" style={{ borderColor: typeColorMap.get(item.type) }}>
                <span>{createdAt}</span>
                <p>
                    {item.message}
                </p>
            </div>
        </li>
    );
}
