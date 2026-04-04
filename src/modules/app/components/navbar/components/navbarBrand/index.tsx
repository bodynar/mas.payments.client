import { FC } from "react";

/** Navbar app brand */
const NavbarBrand: FC = () => {
    return (
        <div className="navbar-brand px-1 py-2">
            <span className="navbar-item is-unselectable is-size-5">
                Payments
            </span>
        </div>
    );
};

export default NavbarBrand;
