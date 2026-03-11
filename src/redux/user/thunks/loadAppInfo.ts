import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { version } from "package.json";

import { get } from "@app/utils";

import { ApplicationInfo } from "@app/models/user";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { setAppInfo } from "@app/redux/user";
import { getNotifications } from "@app/redux/notificator";

/**
 * Get application info
 * @returns Action function that can be called with redux dispatcher
 */
export const getAppInfo = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> =>
    (dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
        getState: () => CompositeAppState
    ): void => {
        dispatch(setAppIsLoading(true));

        const [_, displayError] = getNotifications(dispatch, getState);

        get<AppInfoResponse>(`api/user/getAppInfo`)
            .then((appInfo: AppInfoResponse) => {

                dispatch(setAppInfo({
                    ...appInfo,
                    clientAppVersion: version
                }));

                dispatch(setAppIsLoading(false));
            })
            .catch(displayError);
    };

type AppInfoResponse = Pick<ApplicationInfo, "dataBaseName" | "serverAppVersion">;
