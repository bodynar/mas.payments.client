import { FC } from "react";
import "./style.scss";

/** Skeleton placeholder shown while a module is initializing */
const ModuleLoader: FC = () => {
    return (
        <section className="app-module-loader">
            <div className="app-module-loader__title app-module-loader__bone" />

            <div className="app-module-loader__row">
                <div className="app-module-loader__label app-module-loader__bone" />
                <div className="app-module-loader__field app-module-loader__bone" />
            </div>
            <div className="app-module-loader__row">
                <div className="app-module-loader__label app-module-loader__bone" />
                <div className="app-module-loader__field app-module-loader__bone" />
            </div>
            <div className="app-module-loader__row">
                <div className="app-module-loader__label app-module-loader__bone" />
                <div className="app-module-loader__field app-module-loader__bone" />
            </div>

            <hr className="app-module-loader__divider" />

            <div className="app-module-loader__actions">
                <div className="app-module-loader__button app-module-loader__bone" />
            </div>
        </section>
    );
};

export default ModuleLoader;
