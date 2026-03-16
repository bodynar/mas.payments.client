import { combineReducers } from "@reduxjs/toolkit";

import modalBoxReducer from "@app/redux/modal/slice";
import notificatorReducer from "@app/redux/notificator/slice";
import appReducer from "@app/redux/app/slice";
import userReducer from "@app/redux/user/slice";
import paymentReducer from "@app/redux/payments/slice";
import measurementReducer from "@app/redux/measurements/slice";
import statsReducer from "@app/redux/stats/slice";

/** Global application redux store reducer */
export default combineReducers({
    modal: modalBoxReducer,
    notificator: notificatorReducer,
    app: appReducer,
    user: userReducer,
    payments: paymentReducer,
    measurements: measurementReducer,
    stats: statsReducer,
});
