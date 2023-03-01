import { combineReducers } from "redux";

import modalBoxReducer from "./modal/reducer";
import notificatorReducer from "./notificator/reducer";
import appReducer from "./app/reducer";
import userReducer from "./user/reducer";
import paymentReducer from "./payments/reducer";

import { CompositeAppState } from "./types";

/** Global application redux store reducer */
export default combineReducers<CompositeAppState>({
    modal: modalBoxReducer,
    notificator: notificatorReducer,
    app: appReducer,
    user: userReducer,
    payments: paymentReducer,
});
