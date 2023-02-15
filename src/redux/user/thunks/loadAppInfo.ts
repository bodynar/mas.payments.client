import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { version } from "package.json";

import { get } from "@app/utils/delayedApi";

import { ApplicationInfo } from "@app/models/user";

import { CompositeAppState } from "@app/redux/rootReducer";
import { ActionWithPayload } from "@app/redux/types";
import { getDisplayErrorMessageAction } from "@app/redux/utils";

import { getSetAppIsLoadingAction } from "@app/redux/app/actions/setAppIsLoading";

import { getSetAppInfoAction } from "../actions/setAppInfo";

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
            .catch(getDisplayErrorMessageAction(dispatch, getState));
    };

type AppInfoResponse = Pick<ApplicationInfo, "dataBaseName" | "serverAppVersion">;
