import { connect } from "react-redux";

interface MeasurementModuleProps {

}

const MeasurementModule = (_: MeasurementModuleProps): JSX.Element => {
    return (
        <>
            Measurements
        </>
    );
};

export default connect(
    () => { },
    {

    }
)(MeasurementModule);
