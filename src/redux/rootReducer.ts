import { combineReducers } from 'redux';

import { ModalState } from './modal/types';
import { NotificatorState } from './notificator/types';
import { AppState } from './app/types';

import modalBoxReducer from './modal/reducer';
import notificatorReducer from './notificator/reducer';
import appReducer from './app/reducer';

/** Global application state */
export type CompositeAppState = {
    /** Modal box state */
    modal: ModalState;

    /** Notifications module state */
    notificator: NotificatorState;

    /** Is browser tab with app is in focus */
    app: AppState;
};

/** Global application redux store reducer */
export default combineReducers<CompositeAppState>({
    modal: modalBoxReducer,
    notificator: notificatorReducer,
    app: appReducer,
});
