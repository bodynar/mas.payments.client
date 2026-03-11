import { FC, useCallback, useEffect, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { isNullish } from "@bodynarf/utils";
import { ElementSize } from "@bodynarf/react.components";
import Button, { ButtonStyle } from "@bodynarf/react.components/components/button";

import { CompositeAppState } from "@app/redux";
import { initModuleState } from "@app/redux/measurements";

import BreadCrumbs, { BreadCrumb } from "@bodynarf/react.components/components/breadcrumbs";

import { routes } from "../components";

/** Measurement module component props type */
interface MeasurementModuleProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Initialize payment module state */
    initModuleState: () => void;
}

const MeasurementModule: FC<MeasurementModuleProps> = ({
    initialized,
    initModuleState,
}) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const breadcrumbs: Array<BreadCrumb> = useMemo(
        () =>
            routes
                .flatMap(x => isNullish(x.children) ? [x] : x.children!)
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
                .map((x) => ({
                    href: x.link,
                    caption: x.name,
                })
                ), [pathname]);

    const onBackButtonClick = useCallback(() => navigate(breadcrumbs[breadcrumbs.length - 2].href), [breadcrumbs, navigate]);

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
                elementGenerator={(bc) => <Link to={bc.href}>{bc.caption}</Link>}
            />
            {breadcrumbs.length > 1 &&
                <>
                    <Button
                        outlined
                        caption="Back"
                        style={ButtonStyle.Info}
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
