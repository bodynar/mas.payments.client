import { useEffect, useMemo } from "react";

import { Outlet, useLocation } from "react-router-dom";

import BreadCrumbs from "@app/sharedComponents/breadcrumbs";
import { BreadCrumb } from "@app/sharedComponents/breadcrumbs/types";

import { routes } from '../components';
import { connect } from "react-redux";
import { CompositeAppState } from "@app/redux/rootReducer";
import { initModuleState } from "@app/redux/payments/thunks/init";

type PaymentModuleProps = {
    /** Is module state initialized */
    initialized: boolean;

    /** Initialize payment module state */
    initModuleState: () => void;
};

const PaymentModule = ({ initialized, initModuleState }: PaymentModuleProps): JSX.Element => {
    const { pathname } = useLocation();

    const activeItem = routes.find(({ link }) => link.startsWith(pathname));
    const breadcrumbs: Array<BreadCrumb> = useMemo(
        () =>
            routes
                .filter(({ link }) => pathname.startsWith(link))
                .map(x => ({
                    path: x.link,
                    title: x.name,
                    active: activeItem === x,
                })
                    // eslint-disable-next-line react-hooks/exhaustive-deps
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
