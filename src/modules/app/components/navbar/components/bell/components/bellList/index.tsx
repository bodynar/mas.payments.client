import { NotificationHistoryItem } from "@app/models/notification";

import NotificationStoryRecord from "../notificationStoryRecord";

/** Bell notification list component */
export default function BellList({ notifications }: { notifications: Array<NotificationHistoryItem>; }): JSX.Element {
    if (notifications.length === 0) {
        return (
            <span className="app-bell__empty-list is-italic">
                You haven&apos;t received any notifications yet
            </span>
        );
    }

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
