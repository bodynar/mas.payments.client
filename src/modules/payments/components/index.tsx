import { RouteItem } from "@app/models";

import PaymentList from "./list";
import PaymentCard from "./edit";

import { routes as typeRoutes } from "./paymentTypes/routes";
import PaymentTypeSubModule from "./paymentTypes/component";

/** Payments module sub-routes */
export const routes: Array<RouteItem> = [
    {
        link: "/payment",
        name: "Payment list",
        component: <PaymentList/>,
    },
    {
        link: "/payment/create",
        name: "Create new payment",
        component: <PaymentCard/>,
    },
    {
        link: "/payment/edit/:id",
        name: "Edit payment",
        component: <PaymentCard/>,
    },
    {
        link: "/payment/types",
        name: "Payment types",
        component: <PaymentTypeSubModule/>,
        children: typeRoutes
    },
];
