import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { post } from "@app/utils";

import { CompositeAppState, Action } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getNotifications } from "@app/redux/notificator";

/**
 * Send test email message
 * @returns Action function that can be called with redux dispatcher
 */
export const sendTestEmail = (recipient: string): ThunkAction<void, CompositeAppState, unknown, Action> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
    getState: () => CompositeAppState,
): void => {
    dispatch(getSetAppIsLoadingAction(true));

    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

    post<Array<string>>(`api/user/testMailMessage`, {
        recipient: recipient
    })
        .then(() => {
            displaySuccess("Message sucessfully added to queue");
        })
        .catch(displayError);
};
