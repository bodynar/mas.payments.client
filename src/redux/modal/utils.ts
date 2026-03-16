import { Action, ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { isNullish } from "@bodynarf/utils";
import { ModalCloseData, ModalCallback, ModalState, closeModalAction } from "@app/redux/modal";

/**
 * Close modal via redux dispatched action
 * @param closeModalData Close modal action params
 * @param modalCallback Modal callback from modal configuration
 * @returns Redux action which can be called via dispatch to close modal
 */
export const closeModal = (closeModalData: ModalCloseData, modalCallback?: ModalCallback): ThunkAction<void, ModalState, unknown, Action> =>
    (dispatch: ThunkDispatch<ModalState, unknown, Action>): void => {
        dispatch(closeModalAction());

        if (closeModalData.closeCode === "save" && !isNullish(modalCallback)) {
            modalCallback(closeModalData);
        }
    };


