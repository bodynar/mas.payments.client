import { useCallback } from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { connect } from 'react-redux';

import './notificator.scss';

import { NotificationCountToShowHideAll } from '@app/constants';
import { isStringEmpty } from '@bodynarf/utils/common';
import { NotificationItem } from '@app/models/notification';

import { CompositeAppState } from '@app/redux/rootReducer';

import { getHideNotificationsAction } from '@app/redux/notificator/actions/hideNotification';
import { getHideAllNotificationsAction } from '@app/redux/notificator/actions/hideAllNotifications';

import Notification from '../components/notificationItem/notificationItem';

type NotificatorProps = {
    /** Active notifications */
    notifications: Array<NotificationItem>;

    /** Hide notification handler */
    hideNotifications: (notificationIds: Array<string>) => void;

    /** Hide all active notifications */
    hideAll: () => void;
};

/** Container component for notifications */
function Notificator({ notifications, hideNotifications, hideAll }: NotificatorProps): JSX.Element {
    const hideNotification = useCallback(
        (notificationId: string): void => {
            if (!isStringEmpty(notificationId)) {
                hideNotifications([notificationId]);
            }
        }, [hideNotifications]);

    const hideAllNotifications = useCallback(() => hideAll(), [hideAll]);

    return (
        <TransitionGroup className="app-notificator">
            {notifications.length > NotificationCountToShowHideAll &&
                <CSSTransition
                    key="app-notificator__cleaner"
                    timeout={250}
                    classNames="app-notificator__cleaner"
                >
                    <span
                        className="app-notificator__cleaner"
                        onClick={hideAllNotifications}
                        title="Dismiss all notifications"
                    >
                        Dismiss all
                    </span>
                </CSSTransition>
            }
            {notifications.map(x =>
                <CSSTransition
                    key={x.id}
                    timeout={250}
                    classNames="app-notificator__item"
                >
                    <Notification
                        key={x.id}
                        item={x}
                        onHideClick={hideNotification}
                    />
                </CSSTransition>
            )}
        </TransitionGroup>
    );
}

/** Container component for notifications */
export default connect(
    ({ notificator }: CompositeAppState) => ({ ...notificator }),
    {
        hideNotifications: getHideNotificationsAction,
        hideAll: getHideAllNotificationsAction
    }
)(Notificator);
