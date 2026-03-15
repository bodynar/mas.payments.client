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
            serializableCheck: {
                ignoredPaths: [
                    "payments.typesMap",
                    "measurements.typesMap",
                    "stats.charts",
                    "notificator.notifications",
                    "notificator.history",
                ],
                ignoredActions: [
                    "mas.payments/notification/addNotifications",
                    "mas.payments/modal/openModal",
                ],
            },
        });

        if (import.meta.env.DEV) {
            middleware.push(createLogger() as Middleware);
        }

        return middleware;
    },
});

export default store;
