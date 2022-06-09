import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { isNullOrUndefined } from "@bodynarf/utils/common";

import { ModalAction, ModalCloseData, ModalCallback, ModalState } from "./types";
import { getCloseModalAction } from "./actions/close";

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

     if (closeModalData.closeCode === 'cancel' && !isNullOrUndefined(modalCallback?.cancelCallback)) {
         const customCallback: (modalData: ModalCloseData) => void =
             modalCallback?.cancelCallback as (modalData: ModalCloseData) => void;

         if (isNullOrUndefined(customCallback)) {
             return;
         }

         customCallback(closeModalData);
     }
     else if (closeModalData.closeCode === 'save' && !isNullOrUndefined(modalCallback?.saveCallback)) {
         const customCallback: (modalData: ModalCloseData) => void =
             modalCallback?.saveCallback as (modalData: ModalCloseData) => void;

         if (isNullOrUndefined(customCallback)) {
             return;
         }
         customCallback(closeModalData);
     }
 };
