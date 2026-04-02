import { FC } from "react";
import { Outlet } from "react-router-dom";
import { connect } from "react-redux";

import { CompositeAppState } from "@app/redux";

const TemplateSubModule: FC = () => {
    return (
        <Outlet />
    );
};

/** Payment group templates submodule */
export default connect(
    (_: CompositeAppState) => ({}),
    ({})
)(TemplateSubModule);
