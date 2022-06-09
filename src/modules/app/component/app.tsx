import { useCallback, useEffect } from "react";

import { connect } from "react-redux";

import './app.scss';
import '../../../shared/globalStyles.scss';

import { CompositeAppState } from "@app/redux/rootReducer";

import { getSetTabIsFocusedAction } from "@app/redux/app/actions/setTabIsFocused";

import ModalBox from '@app/modules/modalBox';

import Notificator from '../components/notificator/component/notificator';
import Navbar from "../components/navbar/component/navbar";
import AppContent from "../components/content";

type AppProps = {
    /** 
     * Is app currently loading something important.
     * If so - covers content with loading gif block
    */
    isLoading: boolean;

    /** Store state of app tab focus */
    setTabIsFocused: (isFocused: boolean) => void;
};

/** Root app component */
function App({ isLoading, setTabIsFocused }: AppProps): JSX.Element {
    const onFocus = useCallback(() => setTabIsFocused(true), [setTabIsFocused]);
    const onBlur = useCallback(() => setTabIsFocused(false), [setTabIsFocused]);

    useEffect(() => {
        window.addEventListener('focus', onFocus);
        window.addEventListener('blur', onBlur);

        return (): void => {
            window.removeEventListener('focus', onFocus);
            window.removeEventListener('blur', onBlur);
        };
    }, [onBlur, onFocus]);

    return (
        <main className="app">
            <Navbar className="app__navbar" />
            <ModalBox />
            <Notificator />
            <section className="app__content container">
                <AppContent
                    isLoading={isLoading}
                />
            </section>
        </main>
    );
}

export default connect(
    ({ app }: CompositeAppState) => ({ isLoading: app.loading, }),
    { setTabIsFocused: getSetTabIsFocusedAction, }
)(App);

