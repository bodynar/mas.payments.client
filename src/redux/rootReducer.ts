import { combineReducers } from 'redux';

import { ModalState } from './modal/types';
import { NotificatorState } from './notificator/types';
import { AppState } from './app/types';
import { UserModuleState } from './user/types';
import { PaymentModuleState } from './payments/types';

import modalBoxReducer from './modal/reducer';
import notificatorReducer from './notificator/reducer';
import appReducer from './app/reducer';
import userReducer from './user/reducer';
import paymentReducer from './payments';

/** Global application state */
export type CompositeAppState = {
    /** Modal box state */
    modal: ModalState;

    /** Notifications module state */
    notificator: NotificatorState;

    /** Application misc state */
    app: AppState;

    /** User module state */
    user: UserModuleState;

    /** Payments module state */
    payments: PaymentModuleState;
};

/** Global application redux store reducer */
export default combineReducers<CompositeAppState>({
    modal: modalBoxReducer,
    notificator: notificatorReducer,
    app: appReducer,
    user: userReducer,
    payments: paymentReducer,
});
