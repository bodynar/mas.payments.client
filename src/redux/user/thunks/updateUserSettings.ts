import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { post } from "@app/utils";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getNotifications } from "@app/redux/notificator";

/**
 * Save user settings
 * @returns Action function that can be called with redux dispatcher
 */
export const updateUserSettings = (updatedSettings: Array<UpdatedUserSetting>): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> =>
    (dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
        getState: () => CompositeAppState
    ): Promise<void> => {
        dispatch(getSetAppIsLoadingAction(true));

        const [showSuccess, displayError] = getNotifications(dispatch, getState);

        return post(`api/user/updateUserSettings`, updatedSettings)
            .then(_ => {
                showSuccess("Settings updated successfully");
            })
            .catch(displayError);
    };

/** Updated user setting */
export interface UpdatedUserSetting {
    /** Setting id */
    id: number;

    /** Textual value */
    rawValue: string;
}
