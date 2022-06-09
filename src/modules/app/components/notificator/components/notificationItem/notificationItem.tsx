import { useCallback, useEffect } from 'react';

import './notificationItem.scss';

import { NotificationHideDelay } from '@app/constants';

import { NotificationItem, NotificationType } from '@app/models/notification';

/** Map of notification type to bulma class name */
const typeClassNameMap: Map<NotificationType, string> = new Map([
    ['info', 'is-info'],
    ['success', 'is-success'],
    ['warn', 'is-warning'],
    ['error', 'is-danger'],
]);

/** Single notification component configuration */
type NotificationProps = {
    /** Notification configuration */
    item: NotificationItem;

    /** Close notification click handler */
    onHideClick: (notificationId: string) => void;
};

/** Single notification component */
export default function Notification({ item, onHideClick }: NotificationProps): JSX.Element {
    const hide = useCallback(() => {
        onHideClick(item.id);
    }, [item.id, onHideClick]);

    useEffect(() => {
        const timer = setTimeout(hide, NotificationHideDelay);

        return (): void => { clearTimeout(timer); };
    }, [hide]);

    return (
        <div className={`app-notification notification ${typeClassNameMap.get(item.type)}`}>
            <button
                className="delete"
                onClick={hide}
            ></button>
            {item.message}
        </div>
    );
}
