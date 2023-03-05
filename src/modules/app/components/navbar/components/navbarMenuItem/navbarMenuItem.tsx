import { Link } from "react-router-dom";

import { getClassName } from "@bodynarf/utils/component";

import "./navbarMenuItem.scss";

import { MenuItem } from "@app/models/routeItem";

interface NavbarMenuItemProps {
    /** Menu item configuration */
    item: MenuItem;

    /** Is menu item active */
    isActive: boolean;
}

/** Navar menu item component */
export default function NavbarMenuItem({ item, isActive }: NavbarMenuItemProps): JSX.Element {
    const className = getClassName([
        "app-navbar__item",
        item.disabled === true ? "app-navbar__item--disabled" : "",
        isActive ? "app-navbar__item--active" : "",
    ]);

    if (item.disabled === true || isActive) {
        return (
            <span
                className={className}
            >
                {item.caption}
            </span>
        );
    } else {
        return (
            <Link
                className={className}
                to={item.link}
            >
                {item.caption}
            </Link>
        );
    }
}
