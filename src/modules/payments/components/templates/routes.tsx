import { RouteItem } from "@app/models";

import List from "./components/list";
import Card from "./components/edit";

/** Template module sub-routes */
export const routes: Array<RouteItem> = [
    {
        link: "/payment/templates",
        name: "Templates list",
        component: <List />,
    },
    {
        link: "/payment/templates/create",
        name: "Create new template",
        component: <Card />,
    },
    {
        link: "/payment/templates/edit/:id",
        name: "Edit template",
        component: <Card />,
    },
];
