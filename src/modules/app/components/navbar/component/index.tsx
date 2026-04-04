import { FC, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { isNotNullish, isStringEmpty } from "@bodynarf/utils";

import "./style.scss";

import { NavbarBrand, Bell, NavbarMenuItem, User } from "../components";
import { menuItems as staticMenu } from "@app/static/menu";

interface NavbarProps {
    /** Class for navbar */
    className: string;
}

/**
 * App navigation bar component
 * @throws Classname prop parameter is empty
 */
const Navbar: FC<NavbarProps> = ({ className }) => {
    if (isStringEmpty(className)) {
        throw new Error("className is empty");
    }

    const menuItems = useMemo(() => staticMenu.filter(({ display }) => display !== false), []);
    const { pathname } = useLocation();
    const activeItem = menuItems.find(({ link }) => pathname.startsWith(link))?.name;

    return (
        <nav
            className={`${className} app-navbar navbar is-fixed-top has-shadow is-dark`}
            role="navigation"
            aria-label="main navigation"
        >
            <NavbarBrand />
            <div className="navbar-menu" >
                <div className="navbar-start">
                    {menuItems.map(menuItem =>
                        <NavbarMenuItem
                            key={menuItem.name}
                            item={menuItem}
                            isActive={isNotNullish(activeItem) && menuItem.name === activeItem}
                        />
                    )}
                </div>
                <div className="navbar-end">
                    <User />
                    <Bell />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
