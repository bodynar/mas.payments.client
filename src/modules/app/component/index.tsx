import { useCallback, useEffect, useState } from "react";

import { connect } from "react-redux";

import { getClassName } from "@bodynarf/utils";

import "./style.scss";

import { CompositeAppState } from "@app/redux";
import { getSetTabIsFocusedAction } from "@app/redux/app";
import { loadNotifications } from "@app/redux/user";

import { UserNotification } from "@app/models/user";
import ModalBox from "@app/modules/modalBox";

import Notificator from "../components/notificator";
import Navbar from "../components/navbar";
import AppContent from "../components/content";

interface AppProps {
    /** 
     * Is app currently loading something important.
     * If so - covers content with loading gif block
    */
    isLoading: boolean;

    /** Is modal currently displayed */
    isModalDisplaying: boolean;

    /** Loaded user notification history */
    notifications: Array<UserNotification>;

    /** Load all user notification history */
    loadNotifications: () => Promise<void>;

    /** Store state of app tab focus */
    setTabIsFocused: (isFocused: boolean) => void;
}

/** Root app component */
function App({
    isLoading, isModalDisplaying,
    setTabIsFocused,
    notifications, loadNotifications,
}: AppProps): JSX.Element {
    const onFocus = useCallback(() => setTabIsFocused(true), [setTabIsFocused]);
    const onBlur = useCallback(() => setTabIsFocused(false), [setTabIsFocused]);

    const [loaded, setIsLoaded] = useState(false);

    useEffect(() => {
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);

        return (): void => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
    }, [onBlur, onFocus]);

    useEffect(() => {
        if (!loaded && notifications.length === 0) {
            loadNotifications().then(() => setIsLoaded(true));
        }
    }, [notifications, loadNotifications, loaded]);

    const className = getClassName([
        "app",
        isLoading || isModalDisplaying ? "is-clipped" : ""
    ]);

    return (
        <main className={className}>
            <Navbar className="app__navbar" />
            <ModalBox />
            <Notificator />
            <section className="app__content container my-4">
                <AppContent isLoading={isLoading} />
            </section>
        </main>
    );
}

export default connect(
    ({ app, modal, user }: CompositeAppState) => ({
        isLoading: app.loading,
        isModalDisplaying: modal.isOpen,
        notifications: user.notificationHistory,
    }),
    {
        loadNotifications,
        setTabIsFocused: getSetTabIsFocusedAction,
    }
)(App);
