import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { isNullOrUndefined, isStringEmpty } from "@bodynarf/utils/common";

import './navbar.scss';

import { NavbarBrand, Bell, NavbarMenuItem, User } from '../components';
import { menuItems as staticMenu } from '@app/static/menu';

type NavbarProps = {
    /** Class for navbar */
    className: string;
};

/**
 * App navigation bar component
 * @throws Classname prop parameter is empty
 */
export default function Navbar({ className }: NavbarProps): JSX.Element {
    if (isStringEmpty(className)) {
        throw new Error("className is empty");
    }
    const menuItems = useMemo(() => staticMenu.filter(({ showOnNavbar }) => showOnNavbar !== false), []);
    const { pathname } = useLocation();
    const activeItem = menuItems.find(({ link }) => pathname === link)?.name;

    return (
        <nav
            className={`${className} app-navbar navbar is-dark`}
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
                            isActive={!isNullOrUndefined(activeItem) && menuItem.name === activeItem}
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

}
