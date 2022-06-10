import { Route, Routes } from "react-router-dom";

import './content.scss';

import loading from '@app/assets/loading01.svg';

import { menuItems } from "@app/static/menu";

type AppContentProps = {
    /** 
     * Is app currently loading something important.
     * If so - covers content with loading gif block
    */
    isLoading: boolean;
};

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
                    {menuItems.map(menuItem =>
                        <Route
                            key={menuItem.name}
                            path={menuItem.link}
                            element={menuItem.component}
                        />
                    )}
                </Routes>
            </div>
        </div>
    );
}

export default AppContent;
