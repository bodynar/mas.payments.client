import { isStringEmpty } from "@bodynarf/utils/common";

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
export const menuItems: Array<MenuItem> = []
    .filter((x: MenuItem) => !isStringEmpty(x.name) && !isStringEmpty(x.link));
