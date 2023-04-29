import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { get } from "@app/utils";

import { UserSetting } from "@app/models/user";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetSettingsAction } from "@app/redux/user";
import { displayError } from "@app/redux/notificator";

/**
 * Get user settings
 * @returns Action function that can be called with redux dispatcher
 */
export const loadSettings = (): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState,
): Promise<void> => { // TODO: promise?
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
        .catch(displayError(dispatch, getState));
};
