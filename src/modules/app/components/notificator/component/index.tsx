import { useCallback } from "react";
import { connect } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { isStringEmpty } from "@bodynarf/utils";

import "./style.scss";

import { NotificationCountToShowHideAll } from "@app/static";
import { NotificationItem } from "@app/models/notification";

import { CompositeAppState } from "@app/redux";

import Notification from "../components/notificationItem";
import { hideNotifications } from "@app/redux/user";

interface NotificatorProps {
    /** Active notifications */
    notifications: Array<NotificationItem>;

    /** Hide notification handler */
    hideNotifications: (notificationIds: Array<string>) => void;
}

/** Container component for notifications */
function Notificator({ notifications, hideNotifications }: NotificatorProps): JSX.Element {
    const hideNotification = useCallback(
        (notificationId: string): void => {
            if (!isStringEmpty(notificationId)) {
                hideNotifications([notificationId]);
            }
        }, [hideNotifications]);

    const hideAllNotifications = useCallback(() => hideNotifications([]), [hideNotifications]);

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
        hideNotifications: hideNotifications,
    }
)(Notificator);
