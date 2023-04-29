import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { version } from "package.json";

import { get } from "@app/utils";

import { ApplicationInfo } from "@app/models/user";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetAppInfoAction } from "@app/redux/user";
import { displayError } from "@app/redux/notificator";

/**
 * Get application info
 * @returns Action function that can be called with redux dispatcher
 */
export const getAppInfo = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> =>
    (dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
        getState: () => CompositeAppState
    ): void => {
        dispatch(getSetAppIsLoadingAction(true));

        get<AppInfoResponse>(`api/user/getAppInfo`)
            .then((appInfo: AppInfoResponse) => {

                dispatch(getSetAppInfoAction({
                    ...appInfo,
                    clientAppVersion: version
                }));

                dispatch(getSetAppIsLoadingAction(false));
            })
            .catch(displayError(dispatch, getState));
    };

type AppInfoResponse = Pick<ApplicationInfo, "dataBaseName" | "serverAppVersion">;
