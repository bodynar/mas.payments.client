import { FC, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

import { isNotNullish, isStringEmpty } from "@bodynarf/utils";

import "./style.scss";

import { CompositeAppState } from "@app/redux";
import { NavbarBrand, Bell, NavbarMenuItem, User } from "../components";
import { menuItems as staticMenu } from "@app/static/menu";

interface NavbarProps {
    /** Class for navbar */
    className: string;

    /** Navbar background color */
    navBarColor: string;

    /** Site title */
    navBarTitle: string;
}

/**
 * App navigation bar component
 * @throws Classname prop parameter is empty
 */
const Navbar: FC<NavbarProps> = ({ className, navBarColor, navBarTitle }) => {
    if (isStringEmpty(className)) {
        throw new Error("className is empty");
    }

    const menuItems = useMemo(() => staticMenu.filter(({ display }) => display !== false), []);
    const { pathname } = useLocation();
    const activeItem = menuItems.find(({ link }) => pathname.startsWith(link))?.name;

    useEffect(() => {
        document.title = navBarTitle;
    }, [navBarTitle]);

    return (
        <nav
            className={`${className} app-navbar navbar is-fixed-top has-shadow is-dark`}
            style={{ backgroundColor: navBarColor }}
            role="navigation"
            aria-label="main navigation"
        >
            <NavbarBrand title={navBarTitle} />
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

export default connect(
    ({ user }: CompositeAppState) => ({
        navBarColor: user.settings.find(({ name }) => name === "NavBarColor")?.rawValue ?? "#363636",
        navBarTitle: user.settings.find(({ name }) => name === "NavBarTitle")?.rawValue ?? "Payments",
    })
)(Navbar);
