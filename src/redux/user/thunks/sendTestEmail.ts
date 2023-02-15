import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { post } from "@app/utils/delayedApi";

import { CompositeAppState } from "@app/redux/rootReducer";
import { Action } from "@app/redux/types";
import { getDisplayErrorMessageAction, getDisplaySuccessMessageAction } from "@app/redux/utils";

import { getSetAppIsLoadingAction } from "@app/redux/app/actions/setAppIsLoading";

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
            dispatch(getSetAppIsLoadingAction(false));
            getDisplaySuccessMessageAction(dispatch, getState)("Message sucessfully added to queue");
        } catch (error) {
            getDisplayErrorMessageAction(dispatch, getState)(error as any);
        }
    };
