import { useEffect } from "react";

import { connect } from "react-redux";

import { emptyFn, isNullOrUndefined } from "@bodynarf/utils";

import Text from "@bodynarf/react.components/components/primitives/text";

import { ApplicationInfo as AppInfo } from "@app/models/user";

import { CompositeAppState } from "@app/redux";
import { getAppInfo } from "@app/redux/user";

type ApplicationInfoProps = {
    /** Application information */
    appInfo?: AppInfo;

    /** Load application information */
    getAppInfo: () => void;
};

const ApplicationInfo = ({ appInfo, getAppInfo }: ApplicationInfoProps): JSX.Element => {

    useEffect(() => {
        if (isNullOrUndefined(appInfo)) {
            getAppInfo();
        }
    }, [appInfo, getAppInfo]);

    return (
        <div className="box">
            <Text
                onValueChange={emptyFn}
                defaultValue={appInfo?.dataBaseName || ""}
                disabled={true}
                label={{ caption: "Database name", horizontal: true }}
            />
            <Text
                onValueChange={emptyFn}
                defaultValue={appInfo?.serverAppVersion || ""}
                disabled={true}
                label={{ caption: "Server app version", horizontal: true }}
            />
            <Text
                onValueChange={emptyFn}
                defaultValue={appInfo?.clientAppVersion || ""}
                disabled={true}
                label={{ caption: "Client app version", horizontal: true }}
            />
        </div>
    );
};

/** Application info displaying component */
export default connect(
    ({ user }: CompositeAppState) => ({ appInfo: user.appInfo, }),
    { getAppInfo }
)(ApplicationInfo);
