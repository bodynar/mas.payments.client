import { FC, useCallback, useEffect, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { ButtonStyle, ElementSize } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";

import BreadCrumbs, { BreadCrumb } from "@bodynarf/react.components/components/breadcrumbs";

import { CompositeAppState } from "@app/redux";
import { initModuleState } from "@app/redux/payments";

import { routes } from "../components";
import { isNullish } from "@bodynarf/utils";

interface PaymentModuleProps {
    /** Is module state initialized */
    initialized: boolean;

    /** Initialize payment module state */
    initModuleState: () => void;
}

const PaymentModule: FC<PaymentModuleProps> = ({ initialized, initModuleState }) => {
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
                        caption="Back"
                        style={ButtonStyle.Info}
                        outlined
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

/** Payments module */
export default connect(
    ({ payments }: CompositeAppState) => ({ initialized: payments.initialized, }),
    ({ initModuleState })
)(PaymentModule);
