import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

import rootReducer from "./rootReducer";

/**
 * Redux middleware to provide thunk execution.
 * During development mode also provides redux store changes logger
*/
const middleWare =
    import.meta.env.PRODUCTION
        ? applyMiddleware(thunkMiddleware)
        : applyMiddleware(thunkMiddleware, createLogger());

/** Global application store */
export default createStore(
    rootReducer,
    middleWare
);
