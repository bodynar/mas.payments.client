import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";

import "./style.scss";
import "./shared/globalStyles.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bulma/bulma.sass";
import "bulma-checkradio/dist/css/bulma-checkradio.sass";

import App from "@app/modules/app";

const container = document.getElementById("root");

if (!container) {
    throw new Error("[App] Root element #root not found. Cannot mount the application.");
}

const root = createRoot(container);
root.render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
