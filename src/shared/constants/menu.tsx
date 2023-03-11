import { Navigate } from "react-router-dom";

import { isStringEmpty } from "@bodynarf/utils";

import { MenuItem } from "@app/models/routeItem";

import Payments from "@app/modules/payments";
import Measurements from "@app/modules/measurements";
import Stats from "@app/modules/stats";
import User from "@app/modules/user";

import { routes as userRoutes } from "@app/modules/user/components";
import { routes as paymentRoutes } from "@app/modules/payments/components";

/** Static navbar menu */
export const menuItems: Array<MenuItem> = [
    {
        name: "root",
        caption: "",
        link: "/",
        component: <Navigate to="/user/appInfo" replace />,
        display: false,
    },
    {
        name: "Payments",
        caption: "Payments",
        link: "/payment",
        component: <Payments />,
        children: paymentRoutes
    },
    {
        name: "Measurements",
        caption: "Measurements",
        link: "/measurement",
        component: <Measurements />,
    },
    {
        name: "Stats",
        caption: "Statistics",
        link: "/stats",
        component: <Stats />,
    },
    {
        name: "User",
        caption: "User",
        link: "/user",
        component: <User />,
        display: false,
        children: userRoutes
    },
]
    .filter(x => !isStringEmpty(x.name) && !isStringEmpty(x.link));
