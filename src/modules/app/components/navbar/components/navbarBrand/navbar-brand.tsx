import './navbar-brand.scss';

/** Navbar app brand */
export default function NavbarBrand(): JSX.Element {
    return (
        <div className="navbar-brand app-navbar__brand">
            <span className="app-navbar__name is-unselectable">
                Payments
            </span>
        </div>
    );
}
