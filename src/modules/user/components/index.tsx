import { Navigate } from "react-router-dom";

import { MenuItem } from "@app/models/routeItem";

import ApplicationInfo from "./appInfo";
import Notifications from "./notifications";
import Settings from "./settings/component";
import EmailTest from "./emailTest";

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
    {
        caption: "Email test",
        link: "/user/emailTest",
        name: "emailTest",
        component: <EmailTest />,
    },
];
