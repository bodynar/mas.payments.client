import { NotificationHistoryItem } from "@app/models/notification";

import NotificationStoryRecord from "../notificationStoryRecord/notificationStoryRecord";

/** Bell notification list component */
export default function BellList({ notifications }: { notifications: Array<NotificationHistoryItem>; }): JSX.Element {
    if (notifications.length > 0) {
        return (
            <ul>
                {notifications.map(x =>
                    <NotificationStoryRecord
                        key={x.id}
                        item={x}
                    />
                )}
            </ul>
        );
    }

    return (
        <span className="app-bell__empty-list">
            You haven&apos;t received any notifications yet
        </span>
    );
}
