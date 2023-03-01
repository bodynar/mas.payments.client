import { useEffect, useMemo } from "react";

import { Outlet, useLocation } from "react-router-dom";

import { connect } from "react-redux";

import BreadCrumbs from "@app/sharedComponents/breadcrumbs";
import { BreadCrumb } from "@app/sharedComponents/breadcrumbs/types";

import { CompositeAppState } from "@app/redux";
import { initModuleState } from "@app/redux/payments";

import { routes } from "../components";

type PaymentModuleProps = {
    /** Is module state initialized */
    initialized: boolean;

    /** Initialize payment module state */
    initModuleState: () => void;
};

const PaymentModule = ({ initialized, initModuleState }: PaymentModuleProps): JSX.Element => {
    const { pathname } = useLocation();

    const breadcrumbs: Array<BreadCrumb> = useMemo(
        () =>
            routes
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

                    const pathNameWithouParams = pathname.substring(0, withoutParams.length);

                    return pathNameWithouParams === withoutParams;
                })
                .map((x, i, a) => ({
                    path: x.link,
                    title: x.name,
                    active: a.length - 1 === i,
                })
                ), [pathname]);

    useEffect(() => {
        if (!initialized) {
            initModuleState();
        }
    }, [initModuleState, initialized]);

    return (
        <section>
            <BreadCrumbs items={breadcrumbs} />
            {breadcrumbs.length > 1 &&
                <hr />
            }
            <section>
                <Outlet />
            </section>
        </section >
    );
};

/** Payments module */
export default connect(
    ({ payments }: CompositeAppState) => ({ initialized: payments.initialized, }),
    ({ initModuleState })
)(PaymentModule);
