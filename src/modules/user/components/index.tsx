import { MenuItem } from "@app/models/routeItem";

import ApplicationInfo from "./appInfo";
import Notifications from "./notifications";
import Settings from "./settings";
import EmailTest from "./emailTest";
import UserModuleHome from "./content";

/** User module sub-routes */
export const routes: Array<MenuItem> = [
    {
        caption: 'home',
        link: '',
        name: 'home',
        component: <UserModuleHome/>,
        display: false,
    },
    {
        caption: 'Application info',
        link: '/user/appInfo',
        name: 'appInfo',
        component: <ApplicationInfo/>,
    },
    {
        caption: 'Notifications',
        link: '/user/notifications',
        name: 'notifications',
        component: <Notifications/>,
    },
    {
        caption: 'Settings',
        link: '/user/settings',
        name: 'settings',
        component: <Settings/>,
    },
    {
        caption: 'Email test',
        link: '/user/emailTest',
        name: 'emailTest',
        component: <EmailTest/>,
    },
];
