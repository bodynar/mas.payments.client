import { Outlet } from "react-router-dom";
import { connect } from "react-redux";

import { CompositeAppState } from "@app/redux";

interface MeasurementTypeSubModuleProps {

}

const MeasurementTypeSubModule = (_: MeasurementTypeSubModuleProps): JSX.Element => {
    return (
        <Outlet />
    );
};

/** Measurement types submodule */
export default connect(
    (_: CompositeAppState) => ({} as MeasurementTypeSubModuleProps),
    ({})
)(MeasurementTypeSubModule);
