import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { isNullOrUndefined } from "@bodynarf/utils";

import { post } from "@app/utils";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { getOpenModalAction, ModalType } from "@app/redux/modal/";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getNotifications } from "@app/redux/notificator";

/**
 * Recalculate measurements diff
 * @returns Action function that can be called with redux dispatcher
 */
export const recalculateDiff = (): ThunkAction<Promise<boolean>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState,
): Promise<boolean> => {
    dispatch(getSetAppIsLoadingAction(true));

    const [showSuccess, displayError] = getNotifications(dispatch, getState);

    return post<Array<string>>(`api/measurement/updateDiff`, {})
        .then((result: Array<string> | undefined) => {
            dispatch(getSetAppIsLoadingAction(false));

            if (isNullOrUndefined(result)) {
                showSuccess("Diff successfully re-calculated");
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
            displayError(e);
            return false;
        });
};
