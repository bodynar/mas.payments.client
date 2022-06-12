import Icon from "@bodynarf/react.components/components/icon";

import { Link, useLocation } from "react-router-dom";

import './user.scss';

/**
 * User icon component
 * Displayed as icon in navbar that allows to open user setting page
*/
const UserIcon = (): JSX.Element => {
    const { pathname } = useLocation();

    const isUserModule = pathname.startsWith('/user');
    const icon = isUserModule ? 'person-fill' : 'person';

    if (!isUserModule) {
        return (
            <div
                className="app-user-icon is-flex is-align-items-center"
                data-is-active={true}
            >
                <Link to="/user/appInfo">
                    <span className="icon">
                        <Icon className={icon} />
                    </span>
                </Link>
            </div>
        );
    }
    return (
        <div
            className="app-user-icon is-flex is-align-items-center"
            data-is-active={false}
        >
            <span className="icon">
                <Icon className={icon} />
            </span>
        </div>
    );
};

export default UserIcon;
