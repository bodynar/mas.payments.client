import { RouteItem } from "@app/models/routeItem";

import PaymentList from "./list";
import PaymentCard from "./edit";

/** Payments module sub-routes */
export const routes: Array<RouteItem> = [
    {
        link: "/payment",
        name: "List",
        component: <PaymentList/>,
    },
    {
        link: "/payment/create",
        name: "Create",
        component: <PaymentCard/>,
    },
    {
        link: "/payment/edit/:id",
        name: "Edit",
        component: <PaymentCard/>,
    },
    {
        link: "/payment/types",
        name: "Types",
        component: <>Types</>,
        children: [

        ]
    },
];
