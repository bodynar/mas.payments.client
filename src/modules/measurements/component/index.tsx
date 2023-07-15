import { useCallback, useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { isNullOrUndefined } from "@bodynarf/utils";
import { ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";

import { CompositeAppState } from "@app/redux";
import { initModuleState } from "@app/redux/measurements";

import BreadCrumbs from "@app/sharedComponents/breadcrumbs";
import { BreadCrumb } from "@app/sharedComponents/breadcrumbs/types";

import { routes } from "../components";

/** Measurement module component props type */
interface MeasurementModuleProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Initialize payment module state */
    initModuleState: () => void;
}

const MeasurementModule = ({
    initialized,
    initModuleState,
}: MeasurementModuleProps): JSX.Element => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const breadcrumbs: Array<BreadCrumb> = useMemo(
        () =>
            routes
                .flatMap(x => isNullOrUndefined(x.children) ? [x] : x.children!)
                .filter(({ link }) => {
                    if (pathname.startsWith(link)) {
                        return true;
                    }

                    const hasParams = link.includes(":");

                    if (!hasParams) {
                        return false;
                    }

                    const withoutParams = link.substring(0, link.indexOf(":"));

                    if (!pathname.startsWith(withoutParams)) {
                        return false;
                    }

                    const pathNameWithoutParams = pathname.substring(0, withoutParams.length);

                    return pathNameWithoutParams === withoutParams;
                })
                .map((x, i, a) => ({
                    path: x.link,
                    title: x.name,
                    active: a.length - 1 === i,
                })
                ), [pathname]);

    const onBackButtonClick = useCallback(() => navigate(breadcrumbs[breadcrumbs.length - 2].path), [breadcrumbs, navigate]);

    useEffect(() => {
        if (!initialized) {
            initModuleState();
        }
    }, [initModuleState, initialized]);

    return (
        <section>
            <BreadCrumbs
                items={breadcrumbs}
                className="mb-3"
            />
            {breadcrumbs.length > 1 &&
                <>
                    <Button
                        caption="Back"
                        type="info"
                        outlined={true}
                        size={ElementSize.Small}
                        onClick={onBackButtonClick}
                    />
                    <hr />
                </>
            }
            <section>
                <Outlet />
            </section>
        </section>
    );
};

/** Measurement module component */
export default connect(
    ({ measurements }: CompositeAppState) => ({ initialized: measurements.initialized, }),
    ({ initModuleState })
)(MeasurementModule);
