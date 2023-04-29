import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { isNullOrUndefined } from "@bodynarf/utils";

import { post } from "@app/utils";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { getOpenModalAction, ModalType } from "@app/redux/modal/";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { displayError } from "@app/redux/notificator";

/**
 * Recalculate measurements diff
 * @returns Action function that can be called with redux dispatcher
 */
export const recalculateDiff = (): ThunkAction<Promise<boolean>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState,
): Promise<boolean> => { // TODO: promise?
    dispatch(getSetAppIsLoadingAction(true));

    return post<Array<string>>(`api/measurement/updateDiff1`, {})
        .then((result: Array<string> | undefined) => {
            dispatch(getSetAppIsLoadingAction(false));

            if (isNullOrUndefined(result)) {
                // TODO: Add success notification
                return true;
            }

            dispatch(getOpenModalAction({
                modalType: ModalType.Info,
                title: "Recalculate error",
                message: (result as Array<string>).join("\n")
            }));

            return false;
        })
        .catch((e) => {
            displayError(dispatch, getState)(e);
            return false;
        });
};
