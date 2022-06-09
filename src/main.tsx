import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";

import "./style.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bulma/bulma.sass";

import App from "@app/modules/app";

const container = document.getElementById("root");

const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);
