import { RouteItem } from "@app/models/routeItem";

import PaymentList from "./list";
import EditForm from './edit';

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
        link: '/payment/edit/:id',
        name: 'Edit',
        component: <EditForm/>,
    },
    {
        link: '/payment/types',
        name: 'Types',
        component: <>Types</>,
        children: [

        ]
    },
];
