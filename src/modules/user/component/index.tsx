import { useMemo } from "react";

import { Link, Outlet, useLocation } from "react-router-dom";

import { isNullOrUndefined } from "@bodynarf/utils";

import { routes } from "../components";

/** User module main component */
const UserModule = (): JSX.Element => {
    const { pathname } = useLocation();

    const menu = useMemo(() => routes.filter(({ display }) => display != false), []);
    const activeMenuItem = useMemo(() => menu.find(({ link }) => pathname.startsWith(link)), [pathname, menu]);
    return (
        <>
            <div className="columns">
                <div className="column is-3">
                    <aside className="menu box">
                        <p className="menu-label">
                            User module menu
                        </p>
                        <ul className="menu-list">
                            {menu.map(menuItem =>
                                <li key={menuItem.name}>
                                    <Link
                                        key={menuItem.name}
                                        to={menuItem.link}
                                        className={
                                            !isNullOrUndefined(activeMenuItem) && activeMenuItem?.name === menuItem.name
                                                ? "is-active"
                                                : ""
                                        }
                                    >
                                        {menuItem.caption}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </aside>
                </div>
                <div className="column is-9">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default UserModule;
