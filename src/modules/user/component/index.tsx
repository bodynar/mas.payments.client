import { connect } from "react-redux";

type UserModuleProps = {

};

const UserModule = (props: UserModuleProps): JSX.Element => {
    return (
        <>
            User
        </>
    );
};

export default connect(
    () => { },
    {

    }
)(UserModule);
