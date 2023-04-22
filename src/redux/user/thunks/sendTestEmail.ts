import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { post } from "@app/utils";

import { CompositeAppState, Action, getDisplayErrorMessageAction, getDisplaySuccessMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";

/**
 * Send test email message
 * @returns Action function that can be called with redux dispatcher
 */
export const sendTestEmail = (recipient: string): ThunkAction<void, CompositeAppState, unknown, Action> =>
    async (dispatch: ThunkDispatch<CompositeAppState, unknown, Action>,
        getState: () => CompositeAppState
    ): Promise<void> => {
        dispatch(getSetAppIsLoadingAction(true));

        try {
            await post<Array<string>>(`api/user/testMailMessage`, {
                recipient: recipient
            });

            getDisplaySuccessMessageAction(dispatch, getState)("Message sucessfully added to queue");
        } catch (error) {
            getDisplayErrorMessageAction(dispatch, getState)(error as any);
        }
    };
