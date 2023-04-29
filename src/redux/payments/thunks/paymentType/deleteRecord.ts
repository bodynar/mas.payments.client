import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getOpenModalAction, ModalType } from "@app/redux/modal";
import { getSetPaymentTypesAction } from "@app/redux/payments";
import { displayError, displaySuccess } from "@app/redux/notificator";

import { deleteTypeRecord as deleteRecordAction, getPaymentTypes } from "@app/core/payment";

/**
 * Delete specified payment type
 * @param id Item identifier
 * @returns Action function that can be called with redux dispatcher
 */
export const deleteTypeRecord = (id: number): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState,
): void => {
    const { payments } = getState();

    const paymentType = payments.availableTypes.find((x) => x.id === id)!;

    dispatch(
        getOpenModalAction({
            modalType: ModalType.Confirm,
            title: "Confirm deleting payment type",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure want to delete payment type ${paymentType.caption}?`,
            callback: {
                saveCallback: (): void => {
                    dispatch(getSetAppIsLoadingAction(true));

                    deleteRecordAction(id)
                        .then(() => {
                            displaySuccess(dispatch, getState, false)("Payment type successfully deleted");
                        })
                        .then(getPaymentTypes)
                        .then(items => {
                            dispatch(getSetPaymentTypesAction(items));
                            dispatch(getSetAppIsLoadingAction(false));
                        })
                        .catch(displayError(dispatch, getState));
                },
                cancelCallback: (): void => { }
            }
        }));
};
