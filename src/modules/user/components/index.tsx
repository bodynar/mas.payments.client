import { Navigate } from "react-router-dom";

import { MenuItem } from "@app/models";

import ApplicationInfo from "./appInfo";
import Notifications from "./notifications";
import Settings from "./settings/component";

/** User module sub-routes */
export const routes: Array<MenuItem> = [
    {
        caption: "home",
        link: "",
        name: "home",
        component: <Navigate to="/user/appInfo" replace />,
        display: false,
    },
    {
        caption: "Application info",
        link: "/user/appInfo",
        name: "appInfo",
        component: <ApplicationInfo />,
    },
    {
        caption: "Notifications",
        link: "/user/notifications",
        name: "notifications",
        component: <Notifications />,
    },
    {
        caption: "Settings",
        link: "/user/settings",
        name: "settings",
        component: <Settings />,
    },
];
