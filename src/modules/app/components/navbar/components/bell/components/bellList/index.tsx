import { FC } from "react";

import { NotificationHistoryItem } from "@app/models/notification";

import NotificationStoryRecord from "../notificationStoryRecord";

/** Bell notification list component props */
interface BellListProps {
    /** Notifications to display in the list */
    notifications: Array<NotificationHistoryItem>;
}

/** Bell notification list component */
const BellList: FC<BellListProps> = ({ notifications }) => {
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
};

export default BellList;
