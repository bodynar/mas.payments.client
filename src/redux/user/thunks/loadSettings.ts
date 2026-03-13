import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { get } from "@app/utils";

import { UserSetting } from "@app/models/user";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { setSettings } from "@app/redux/user";
import { getNotifications } from "@app/redux/notificator";

/**
 * Get user settings
 * @returns Action function that can be called with redux dispatcher
 */
export const loadSettings = (): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState,
): Promise<void> => {
    dispatch(setAppIsLoading(true));

    const [_, displayError] = getNotifications(dispatch, getState);

    return get<Array<UserSetting>>(`api/user/getSettings`)
        .then((settings: Array<any>) => {
            dispatch(
                setSettings(
                    settings.map(x => ({
                        displayName: x["displayName"],
                        id: x["id"],
                        name: x["name"],
                        rawValue: x["rawValue"],
                        type: x["typeName"].toLowerCase()
                    }) as UserSetting)
                )
            );

            dispatch(setAppIsLoading(false));
        })
        .catch(displayError);
};
