import { FC } from "react";

interface NavbarBrandProps {
    /** Site title */
    title: string;
}

/** Navbar app brand */
const NavbarBrand: FC<NavbarBrandProps> = ({ title }) => {
    return (
        <div className="navbar-brand px-1 py-2">
            <span className="navbar-item is-unselectable is-size-5">
                {title}
            </span>
        </div>
    );
};

export default NavbarBrand;
