import { configureStore, Middleware } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { createLogger } from "redux-logger";

import rootReducer from "./rootReducer";

enableMapSet();

/** Global application store */
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware({
            serializableCheck: false,
        });

        if (!import.meta.env.PRODUCTION) {
            middleware.push(createLogger() as Middleware);
        }

        return middleware;
    },
});

export default store;

/** Application dispatch type */
export type AppDispatch = typeof store.dispatch;
