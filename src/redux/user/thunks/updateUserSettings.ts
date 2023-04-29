import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { post } from "@app/utils";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { displayError } from "@app/redux/notificator";

/**
 * Save user settings
 * @returns Action function that can be called with redux dispatcher
 */
export const updateUserSettings = (updatedSettings: Array<UpdatedUserSetting>): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> =>
    (dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
        getState: () => CompositeAppState
    ): Promise<void> => { // TODO: promise?
        dispatch(getSetAppIsLoadingAction(true));
        // TODO: Add success notification
        return post(`api/user/updateUserSettings`, updatedSettings)
            .then(_ => undefined)
            .catch(displayError(dispatch, getState));
    };

/** Updated user setting */
export interface UpdatedUserSetting {
    /** Setting id */
    id: number;

    /** Textual value */
    rawValue: string;
}
