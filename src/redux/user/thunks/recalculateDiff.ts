import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { isNullOrUndefined } from "@bodynarf/utils";

import { post } from "@app/utils/delayedApi";

import { CompositeAppState } from "@app/redux/rootReducer";
import { ActionWithPayload } from "@app/redux/types";
import { getDisplayErrorMessageAction } from "@app/redux/utils";

import { getOpenModalAction } from "@app/redux/modal/actions/open";
import { getSetAppIsLoadingAction } from "@app/redux/app/actions/setAppIsLoading";
import { ModalAction } from "@app/redux/modal/types";

/**
 * Recalculate measurements diff
 * @returns Action function that can be called with redux dispatcher
 */
export const recalculateDiff = (): ThunkAction<Promise<boolean>, CompositeAppState, unknown, ActionWithPayload | ModalAction> =>
    (dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload | ModalAction>,
        getState: () => CompositeAppState
    ): Promise<boolean> => {
        dispatch(getSetAppIsLoadingAction(true));

        return post<Array<string>>(`api/measurement/updateDiff1`, {})
            .then((result: Array<string> | undefined) => {
                dispatch(getSetAppIsLoadingAction(false));

                if (isNullOrUndefined(result)) {
                    // TODO: Add success notification
                    return true;
                }

                dispatch(getOpenModalAction({
                    modalType: 'info',
                    title: 'Recalculate error',
                    message: (result as Array<string>).join("\n")
                }));

                return false;
            })
            .catch((e) => {
                getDisplayErrorMessageAction(dispatch, getState)(e);
                return false;
            });
    };
