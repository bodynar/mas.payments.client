import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { isNullOrUndefined } from "@bodynarf/utils";

import { Action } from "@app/redux";
import { ModalCloseData, ModalCallback, ModalState, getCloseModalAction } from "@app/redux/modal";

/**
 * Close modal via redux dispatched action
 * @param closeModalData Close modal action params
 * @param modalCallback Modal callbacks from modal configuration
 * @returns Redux action which can be called via dispatch to close modal
 */
export const closeModal = (closeModalData: ModalCloseData, modalCallback?: ModalCallback): ThunkAction<void, ModalState, unknown, Action> =>
    (dispatch: ThunkDispatch<ModalState, unknown, Action>): void => {
        dispatch(getCloseModalAction());

        if (isNullOrUndefined(modalCallback)) {
            return;
        }

        if (closeModalData.closeCode === "cancel" && !isNullOrUndefined(modalCallback!.cancelCallback)) {
            modalCallback!.cancelCallback!(closeModalData);
        }
        else if (closeModalData.closeCode === "save" && !isNullOrUndefined(modalCallback!.saveCallback)) {
            modalCallback!.saveCallback!(closeModalData);
        }
    };


