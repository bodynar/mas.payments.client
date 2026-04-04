import { FC, useCallback, useEffect } from "react";

import { emptyFn } from "@bodynarf/utils";

import "./style.scss";

import { NotificationHideDelay } from "@app/static";
import { NotificationItem, NotificationType } from "@app/models/notification";

/** Map of notification type to bulma class name */
const typeClassNameMap: Map<NotificationType, string> = new Map([
    [NotificationType.info, "is-info"],
    [NotificationType.success, "is-success"],
    [NotificationType.warn, "is-warning"],
    [NotificationType.error, "is-danger"],
]);

/** Single notification component configuration */
interface NotificationProps {
    /** Notification configuration */
    item: NotificationItem;

    /** Close notification click handler */
    onHideClick: (notificationId: string) => void;
}

/** Single notification component */
const Notification: FC<NotificationProps> = ({ item, onHideClick }) => {
    const hide = useCallback(() => onHideClick(item.id), [item.id, onHideClick]);

    useEffect(() => {
        if (!item.important) {
            const timer = setTimeout(hide, NotificationHideDelay);

            return (): void => { clearTimeout(timer); };
        }

        return emptyFn;
    }, [hide, item.important]);

    return (
        <div className={`app-notificator__item notification ${typeClassNameMap.get(item.type)}`}>
            <button
                className="delete"
                onClick={hide}
            ></button>
            {item.message}
        </div>
    );
};

export default Notification;
