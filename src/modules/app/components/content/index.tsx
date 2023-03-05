import { Route, Routes } from "react-router-dom";

import "./content.scss";

import loading from "@app/assets/loading01.svg";

import { menuItems } from "@app/static/menu";
import { RouteItem } from "@app/models/routeItem";

interface AppContentProps {
    /** 
     * Is app currently loading something important.
     * If so - covers content with loading gif block
    */
    isLoading: boolean;
}

/**
 * Block of application main content
 */
function AppContent({ isLoading }: AppContentProps): JSX.Element {
    return (
        <div className="app-loading-cover">
            {isLoading &&
                <div className="app-loading-cover__image">
                    <img src={loading} alt="loading" />
                </div>
            }
            <div
                className="app-loading-cover__content"
                data-disabled={isLoading}
            >
                <Routes>
                    {menuItems.map(menuItem => getRouteItem(menuItem))}
                </Routes>
            </div>
        </div>
    );
}

/**
 * Get module routing table as tree of react-router components.
 * Presented as function (not component) to satisfy react-router Routes rule (child type)
*/
const getRouteItem = ({ name, link, component, children }: RouteItem): JSX.Element => {
    return (
        <Route
            key={name}
            path={link}
            element={component}
        >
            {children?.map(c => getRouteItem(c))}
        </Route>
    );
};

export default AppContent;
