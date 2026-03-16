/** Route config item */
export interface RouteItem {
    /** Unique name */
    name: string;

    /** Target route link */
    link: string;

    /** Which component should be rendered as module */
    component: JSX.Element;

    /** Child routes */
    children?: Array<RouteItem>;
}

/**
 * Model for route menu item.
 * Displayable information about route
*/
export interface MenuItem extends RouteItem {
    /** Caption */
    caption: string;

    /** Should item be readonly */
    disabled?: boolean;

    /** Should be item be presented */
    display?: boolean;
}
