import { useCallback, useEffect } from "react";

import { connect } from "react-redux";

import { getClassName } from "@bodynarf/utils";

import "./style.scss";

import { CompositeAppState } from "@app/redux";
import { getSetTabIsFocusedAction } from "@app/redux/app";

import ModalBox from "@app/modules/modalBox";

import Notificator from "../components/notificator/component/notificator";
import Navbar from "../components/navbar/component/navbar";
import AppContent from "../components/content";

interface AppProps {
    /** 
     * Is app currently loading something important.
     * If so - covers content with loading gif block
    */
    isLoading: boolean;

    /** Is modal currently displayed */
    isModalDisplaying: boolean;

    /** Store state of app tab focus */
    setTabIsFocused: (isFocused: boolean) => void;
}

/** Root app component */
function App({
    isLoading, isModalDisplaying,
    setTabIsFocused,
}: AppProps): JSX.Element {
    const onFocus = useCallback(() => setTabIsFocused(true), [setTabIsFocused]);
    const onBlur = useCallback(() => setTabIsFocused(false), [setTabIsFocused]);

    useEffect(() => {
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);

        return (): void => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
    }, [onBlur, onFocus]);

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
    ({ app, modal }: CompositeAppState) => ({
        isLoading: app.loading,
        isModalDisplaying: modal.isOpen,
    }),
    { setTabIsFocused: getSetTabIsFocusedAction, }
)(App);

