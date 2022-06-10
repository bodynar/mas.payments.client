import { isStringEmpty } from "@bodynarf/utils/common";

import Payments from "@app/modules/payments";
import Measurements from "@app/modules/measurements";
import Stats from "@app/modules/stats";
import User from "@app/modules/user";

/** Model for navbar menu items */
export interface MenuItem {
    /** Unique name */
    name: string;

    /** Caption */
    caption: string;

    /** Target route link */
    link: string;

    /** Should item be readonly */
    disabled?: boolean;

    /** Which component should be rendered as module */
    component: JSX.Element;

    /** Should be item be presented in top navbar */
    showOnNavbar?: boolean;
}

/** Static navbar menu */
export const menuItems: Array<MenuItem> = [
    {
        name: 'Payments',
        caption: 'Payments',
        link: '/payment',
        component: <Payments />,
    },
    {
        name: 'Measurements',
        caption: 'Measurements',
        link: '/measurement',
        component: <Measurements />,
    },
    {
        name: 'Stats',
        caption: 'Statistics',
        link: '/stats',
        component: <Stats />,
    },
    {
        name: 'User',
        caption: 'User',
        link: '/user',
        component: <User />,
        showOnNavbar: false,
    },
]
    .filter(x => !isStringEmpty(x.name) && !isStringEmpty(x.link));
