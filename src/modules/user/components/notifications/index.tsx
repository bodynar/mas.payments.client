import { useEffect, useState, useCallback, useMemo } from "react";

import { connect } from "react-redux";

import Button from "@bodynarf/react.components/components/button";
import Paginator from "@bodynarf/react.components/components/paginator";
import { usePagination } from "@bodynarf/react.components";

import { CompositeAppState } from "@app/redux/rootReducer";
import { loadNotifications } from "@app/redux/user/thunks/loadNotifications";

import { UserNotification } from "@app/models/user";

type NotificationsProps = {
    /**  Loaded user notification history */
    notifications: Array<UserNotification>;

    /** Loadd all user notification history */
    loadNotifications: () => Promise<void>;
};

const Notifications = ({ notifications, loadNotifications }: NotificationsProps): JSX.Element => {
    const [loaded, setIsLoaded] = useState(false);
    const [ascSort, setAscSort] = useState(false);

    useEffect(() => {
        if (!loaded && notifications.length === 0) {
            loadNotifications().then(() => setIsLoaded(true));
        }
    }, [notifications, loadNotifications, loaded]);

    const onReloadClick = useCallback(() => loadNotifications().then(() => setIsLoaded(true)), [loadNotifications]);

    const [{ currentPage, pagesCount, onPageChange }, paginate] = usePagination(notifications.length, 15);
    const pageItems = useMemo(() => paginate(notifications), [paginate, notifications]);

    return (
        <div className="box">
            {(loaded || notifications.length > 0) &&
                <>
                    <div className="block columns is-align-items-center">
                        <div className="column is-2">
                            <span className="has-text-weight-bold">Notifications</span>: {notifications.length}
                        </div>
                        <div className="column is-2">
                            <Button
                                type="success"
                                caption="Reload"
                                size="small"
                                rounded={true}
                                outlined={true}
                                icon={{ className: "arrow-clockwise", position: "left" }}
                                onClick={onReloadClick}
                            />
                        </div>
                    </div>
                    <div className="block columns">
                        <div className="column is-3">
                            <Button
                                type="ghost"
                                caption="Order by CreatedOn"
                                size="small"
                                icon={{
                                    position: "left",
                                    className: ascSort ? "sort-down" : "sort-up",
                                }}
                                onClick={() => setAscSort(x => !x)}
                            />
                        </div>
                    </div>
                    <div className="block">
                        {pageItems.map(x =>
                            <div key={x.id}
                                className={`message my-2 is-${x.type.toLocaleLowerCase()}`}
                            >
                                <div className="message-body">
                                    <h4 className="has-text-weight-bold mb-2">
                                        {x.title}
                                    </h4>
                                    <p>
                                        {x.text}
                                    </p>
                                </div>
                            </div>
                        )}
                        <Paginator
                            position='right'
                            showNextButtons={true}
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
    ({ user }: CompositeAppState) => ({ notifications: user.notificationHistory }),
    { loadNotifications }
)(Notifications);
