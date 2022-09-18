import { RouteItem } from "@app/models/routeItem";

import PaymentList from "./list";

/** Payments module sub-routes */
export const routes: Array<RouteItem> = [
    {
        link: '/payment',
        name: 'List',
        component: <PaymentList/>,
    },
    {
        link: '/payment/create',
        name: 'Create',
        component: <>Create</>,
    },
    {
        link: '/payment/edit',
        name: 'Edit',
        component: <>Edit</>,
    },
    {
        link: '/payment/types',
        name: 'Types',
        component: <>Types</>,
        children: [

        ]
    },
];
