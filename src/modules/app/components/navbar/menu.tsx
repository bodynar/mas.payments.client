import { isStringEmpty } from "@bodynarf/utils/common";

import Comments from "@app/modules/comments/index";
import Stats from '@app/modules/stats/component/stats';

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
}

/** Static navbar menu */
export const menuItems: Array<MenuItem> = [
    {
        name: 'Comments',
        caption: 'Comments',
        link: '/',
        component: <Comments />,
    },
    {
        name: 'stats',
        caption: 'Statistics',
        link: '/stats/',
        component: <Stats />,
    }
].filter(x => !isStringEmpty(x.name) && !isStringEmpty(x.link));
