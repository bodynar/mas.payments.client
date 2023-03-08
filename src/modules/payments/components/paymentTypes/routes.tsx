import { RouteItem } from "@app/models/routeItem";

import List from "./components/list";
import Card from "./components/edit";

/** Payments module sub-routes */
export const routes: Array<RouteItem> = [
    {
        link: "/payment/types",
        name: "Types list",
        component: <List/>,
    },
    {
        link: "/payment/types/create",
        name: "Create new payment type",
        component: <Card/>,
    },
    {
        link: "/payment/types/edit/:id",
        name: "Edit payment type",
        component: <Card/>,
    },
];
