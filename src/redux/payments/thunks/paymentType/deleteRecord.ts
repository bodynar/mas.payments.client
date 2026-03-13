import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { openModal, ModalType } from "@app/redux/modal";
import { setPaymentTypes } from "@app/redux/payments";
import { getNotifications } from "@app/redux/notificator";

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
        openModal({
            modalType: ModalType.Confirm,
            title: "Confirm deleting payment type",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure you want to delete payment type ${paymentType.caption}?`,
            callback: (): void => {
                    dispatch(setAppIsLoading(true));

                    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

                    deleteRecordAction(id)
                        .then(() => {
                            displaySuccess("Payment type successfully deleted", false);
                        })
                        .then(getPaymentTypes)
                        .then(items => {
                            dispatch(setPaymentTypes(items));
                            dispatch(setAppIsLoading(false));
                        })
                        .catch(displayError);
                },
        }));
};
