import './navbar-brand.scss';

import { GitlabLogoIcon } from '../';

/** Navbar app brand */
export default function NavbarBrand(): JSX.Element {
    return (
        <div className="navbar-brand app-navbar__brand">
            <GitlabLogoIcon />
            <span className="app-navbar__name is-unselectable">
                Gitlab Comments
            </span>
        </div>
    );
}
