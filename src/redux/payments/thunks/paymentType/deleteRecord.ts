import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { CompositeAppState, getDisplayErrorMessageAction, getDisplaySuccessMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getOpenModalAction, ModalAction } from "@app/redux/modal";
import { getSetPaymentTypesAction } from "@app/redux/payments";

import { deleteTypeRecord as deleteRecordAction, getPaymentTypes } from "@app/core/payment";

/**
 * Delete specified payment type
 * @param id Item identifier
 * @returns Action function that can be called with redux dispatcher
 */
export const deleteTypeRecord = (id: number): ThunkAction<void, CompositeAppState, unknown, ModalAction> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ModalAction>,
    getState: () => CompositeAppState
): void => {
    const { payments } = getState();

    const paymentType = payments.availableTypes.find((x) => x.id === id)!;

    dispatch(
        getOpenModalAction({
            modalType: "confirm",
            title: "Confirm deleting payment type",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure want to delete payment type ${paymentType.caption}?`,
            callback: {
                saveCallback: async (): Promise<void> => {
                    dispatch(getSetAppIsLoadingAction(true));

                    await deleteRecordAction(id);

                    getDisplaySuccessMessageAction(dispatch, getState)("Payment type successfully deleted");

                    getPaymentTypes()
                        .then(items => {
                            dispatch(getSetPaymentTypesAction(items));
                            dispatch(getSetAppIsLoadingAction(false));
                        })
                        .catch(getDisplayErrorMessageAction(dispatch, getState));
                },
                cancelCallback: (): void => { }
            }
        }));
};
