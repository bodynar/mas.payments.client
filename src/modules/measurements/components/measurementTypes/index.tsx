import { RouteItem } from "@app/models/routeItem";

import List from "./components/list";
import Card from "./components/edit";

/** Payments module sub-routes */
export const routes: Array<RouteItem> = [
    {
        link: "/measurement/types",
        name: "Types list",
        component: <List/>,
    },
    {
        link: "/measurement/types/create",
        name: "Create new measurement type",
        component: <Card/>,
    },
    {
        link: "/measurement/types/edit/:id",
        name: "Edit measurement type",
        component: <Card/>,
    },
];
