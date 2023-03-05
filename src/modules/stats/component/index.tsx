import { connect } from "react-redux";

interface StatsModuleProps {

}

const StatsModule = (_: StatsModuleProps): JSX.Element => {
    return (
        <>
            Stats
        </>
    );
};

export default connect(
    () => { },
    {

    }
)(StatsModule);
