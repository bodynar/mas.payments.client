import { FC, useCallback, useMemo } from "react";
import { connect } from "react-redux";

import { isNullish } from "@bodynarf/utils";
import { formatDate } from "@bodynarf/utils/date";

import Button from "@bodynarf/react.components/components/button";
import Paginator from "@bodynarf/react.components/components/paginator";
import { ButtonStyle, ElementPosition, ElementSize, usePagination } from "@bodynarf/react.components";

import { CompositeAppState } from "@app/redux";
import { loadNotifications, toggleNotificationsSortOrder } from "@app/redux/user/";

import { UserNotification } from "@app/models/user";

interface NotificationsProps {
    /** Loaded user notification history */
    notifications: Array<UserNotification>;

    /** Is notifications sorted ascending by CreatedAt field */
    ascSort: boolean;

    /** Load all user notification history */
    loadNotifications: () => Promise<void>;

    /** Toggle sort order for notifications */
    toggleSort: () => void;
}

const Notifications: FC<NotificationsProps> = ({ notifications, loadNotifications, ascSort, toggleSort }) => {
    const onReloadClick = useCallback(() => loadNotifications(), [loadNotifications]);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(notifications.length, 15);
    const pageItems: Array<UserNotification> = useMemo(
        () => paginate(
            [...notifications].sort(({ createdAt }, y) =>
                ((createdAt?.getTime() ?? 0) - (y.createdAt?.getTime() ?? 0)) * (ascSort ? -1 : 1)
            )
        ) as Array<UserNotification>,
        [ascSort, paginate, notifications]
    );

    return (
        <div className="box">
            {notifications.length > 0 &&
                <>
                    <div className="block columns is-align-items-center">
                        <div className="column is-2">
                            <span className="has-text-weight-bold">Notifications</span>: {notifications.length}
                        </div>
                        <div className="column is-2">
                            <Button
                                style={ButtonStyle.Success}
                                caption="Reload"
                                size={ElementSize.Small}
                                rounded
                                outlined
                                icon={{ name: "arrow-clockwise", position: ElementPosition.Left, size: ElementSize.Medium, }}
                                onClick={onReloadClick}
                            />
                        </div>
                    </div>
                    <div className="block columns">
                        <div className="column is-3">
                            <Button
                                style={ButtonStyle.Ghost}
                                caption="Order by creation date"
                                size={ElementSize.Small}
                                icon={{
                                    position: ElementPosition.Left,
                                    name: ascSort ? "sort-down" : "sort-up",
                                    size: ElementSize.Medium,
                                }}
                                onClick={toggleSort}
                            />
                        </div>
                    </div>
                    <div className="block">
                        {pageItems.map(x =>
                            <div key={x.id}
                                className={`message my-2 is-${x.type.toLocaleLowerCase()}`}
                            >
                                <div className="message-body">
                                    <div className="columns">
                                        <div className="column is-four-fifths">
                                            <h4 className="has-text-weight-bold">
                                                {x.title}
                                            </h4>
                                        </div>
                                        {isNullish(x.hiddenAt)
                                            ?
                                            <>
                                                <div className="column">
                                                    <span className="is-italic">
                                                        Created on {formatDate(x.createdAt!, "dd.MM.yyyy")}
                                                    </span>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="column">
                                                    <span className="is-italic has-title" title={`Mark as read on ${formatDate(x.hiddenAt!, "dd.MM.yyyy")}`}>
                                                        Created on {formatDate(x.createdAt!, "dd.MM.yyyy")}
                                                    </span>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <p>
                                        {x.text}
                                    </p>
                                </div>
                            </div>
                        )}
                        <Paginator
                            position={ElementPosition.Right}
                            showNextButtons
                            nearPagesCount={2}
                            count={pagesCount}
                            currentPage={currentPage}
                            onPageChange={onPageChange}
                        />
                    </div>
                </>
            }
        </div>
    );
};

export default connect(
    ({ user }: CompositeAppState) => ({
        notifications: user.notificationHistory,
        ascSort: user.isNotificationSortOrderAsc
    }),
    {
        loadNotifications,
        toggleSort: toggleNotificationsSortOrder
    }
)(Notifications);
