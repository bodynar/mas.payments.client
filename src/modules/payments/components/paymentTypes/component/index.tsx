import { FC } from "react";
import { Outlet } from "react-router-dom";
import { connect } from "react-redux";

import { CompositeAppState } from "@app/redux";

interface PaymentTypeSubModuleProps {

}

const PaymentTypeSubModule: FC<PaymentTypeSubModuleProps> = (_) => {
    return (
        <Outlet />
    );
};

/** Payment types submodule */
export default connect(
    (_: CompositeAppState) => ({} as PaymentTypeSubModuleProps),
    ({})
)(PaymentTypeSubModule);
