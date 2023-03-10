import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { isNullOrUndefined } from "@bodynarf/utils";

import { ModalAction, ModalCloseData, ModalCallback, ModalState, getCloseModalAction } from "@app/redux/modal";

/**
 * Close modal via redux dispatched action
 * @param closeModalData Close modal action params
 * @param modalCallback Modal callbacks from modal configuration
 * @returns Redux action which can be called via dispatch to close modal
 */
export const closeModal = (closeModalData: ModalCloseData, modalCallback?: ModalCallback): ThunkAction<void, ModalState, unknown, ModalAction> =>
    (dispatch: ThunkDispatch<ModalState, unknown, ModalAction>): void => {
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


