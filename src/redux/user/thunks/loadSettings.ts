import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { get } from "@app/utils/delayedApi";

import { UserSetting } from "@app/models/user";

import { CompositeAppState } from "@app/redux/rootReducer";
import { ActionWithPayload } from "@app/redux/types";
import { getDisplayErrorMessageAction } from "@app/redux/utils";

import { getSetAppIsLoadingAction } from "@app/redux/app/actions/setAppIsLoading";

import { getSetSettingsAction } from "../actions/setSettings";

/**
 * Get user settings
 * @returns Action function that can be called with redux dispatcher
 */
export const loadSettings = (): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> =>
    (dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
        getState: () => CompositeAppState
    ): Promise<void> => {
        dispatch(getSetAppIsLoadingAction(true));

        return get<Array<UserSetting>>(`api/user/getSettings`)
            .then((settings: Array<any>) => {
                dispatch(
                    getSetSettingsAction(
                        settings.map(x => ({
                            displayName: x["displayName"],
                            id: x["id"],
                            name: x["name"],
                            rawValue: x["rawValue"],
                            type: x["typeName"].toLowerCase()
                        }) as UserSetting)
                    )
                );

                dispatch(getSetAppIsLoadingAction(false));
            })
            .catch(getDisplayErrorMessageAction(dispatch, getState));
    };
