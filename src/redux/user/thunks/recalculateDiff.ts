import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { isNullish } from "@bodynarf/utils";

import { post } from "@app/utils";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { openModal, ModalType } from "@app/redux/modal/";
import { setAppIsLoading } from "@app/redux/app";
import { getNotifications } from "@app/redux/notificator";

/**
 * Recalculate measurements diff
 * @returns Action function that can be called with redux dispatcher
 */
export const recalculateDiff = (): ThunkAction<Promise<boolean>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState,
): Promise<boolean> => {
    dispatch(setAppIsLoading(true));

    const [showSuccess, displayError] = getNotifications(dispatch, getState);

    return post<Array<string>>(`api/measurement/updateDiff`, {})
        .then((result: Array<string> | undefined) => {
            dispatch(setAppIsLoading(false));

            if (isNullish(result) || result.length === 0) {
                showSuccess("Diff successfully recalculated");
                return true;
            }

            dispatch(openModal({
                modalType: ModalType.Info,
                title: "Recalculate error",
                message: result.join("\n")
            }));

            return false;
        })
        .catch((e) => {
            displayError(e);
            return false;
        });
};
