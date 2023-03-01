import { useCallback, useState } from "react";

import { connect } from "react-redux";

import Icon from "@bodynarf/react.components/components/icon";
import { useComponentOutsideClick } from "@bodynarf/react.components/hooks/useComponentOutsideClick";

import "./bell.scss";

import { NotificationHistoryItem } from "@app/models/notification";

import { CompositeAppState } from "@app/redux";
import { setNotificationsBadgeToZero } from "@app/redux/notificator/";

import BellList from "../components/bellList/bellList";

type BellProps = {
    /** All notifications in current session */
    notifications: Array<NotificationHistoryItem>;

    /** Amount of unread notifications */
    notificationBadge: number;

    /** Handler of open notifications list action  */
    onListOpened: () => void;
};

/** Bell with notifications component */
function Bell(props: BellProps): JSX.Element {
    const [isListVisible, setListVisibility] = useState<boolean>(false);

    const onBellClick = useCallback(
        () => {
            setListVisibility(!isListVisible);

            if (props.notificationBadge !== 0) {
                props.onListOpened();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isListVisible, props.notificationBadge, props.onListOpened]
    );

    useComponentOutsideClick(
        ".app-bell",
        isListVisible,
        () => setListVisibility(false),
    );

    const shouldBadgeBeVisible: boolean = props.notificationBadge > 0;
    const badgeNumber: string = props.notificationBadge > 9 ? "9+" : `${props.notificationBadge}`;
    const title: string = shouldBadgeBeVisible ? `${badgeNumber} new notifications` : "No new notifications";
    const listClassName: string = !shouldBadgeBeVisible
        ? "app-bell__list app-bell__list--empty"
        : "app-bell__list";

    return (
        <div className="app-bell">
            <div
                className={`app-bell__icon${isListVisible ? " app-bell__icon--opened" : ""}`}
                onClick={onBellClick}
                title={title}
            >
                <Icon name="bell" />
                {shouldBadgeBeVisible &&
                    <span className="app-bell__badge">{badgeNumber}</span>
                }
            </div>
            <div className={listClassName} aria-hidden={!isListVisible}>
                <div className="app-bell__list-wrapper">
                    <BellList notifications={props.notifications} />
                </div>
            </div>
        </div>
    );
}

export default connect(
    ({ notificator }: CompositeAppState) => ({
        notifications: notificator.history,
        notificationBadge: notificator.historyBadgeCount
    }),
    { onListOpened: setNotificationsBadgeToZero }
)(Bell);
