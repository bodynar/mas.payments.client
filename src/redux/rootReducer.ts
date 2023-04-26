import { combineReducers } from "redux";

import { CompositeAppState } from "@app/redux";

import modalBoxReducer from "@app/redux/modal/reducer";
import notificatorReducer from "@app/redux/notificator/reducer";
import appReducer from "@app/redux/app/reducer";
import userReducer from "@app/redux/user/reducer";
import paymentReducer from "@app/redux/payments/reducer";
import measurementReducer from "@app/redux/measurements/reducer";
import statsReducer from "@app/redux/stats/reducer";

/** Global application redux store reducer */
export default combineReducers<CompositeAppState>({
    modal: modalBoxReducer,
    notificator: notificatorReducer,
    app: appReducer,
    user: userReducer,
    payments: paymentReducer,
    measurements: measurementReducer,
    stats: statsReducer,
});
