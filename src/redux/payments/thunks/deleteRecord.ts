import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { deleteRecord as deleteRecordAction, getPaymentRecords } from "@app/core/payment";
import { getMonthName } from "@app/utils";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { openModal, ModalType } from "@app/redux/modal";
import { setPayments } from "@app/redux/payments";
import { getNotifications } from "@app/redux/notificator";

/**
 * Delete specified payment
 * @returns Action function that can be called with redux dispatcher
 */
export const deleteRecord = (id: number): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    const { payments } = getState();

    const payment = payments.payments.find((x) => x.id === id)!;

    dispatch(
        openModal({
            modalType: ModalType.Confirm,
            title: "Confirm deleting payment",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure you want to delete payment record for ${getMonthName(payment.month)} ${payment.year}?`,
            callback: (): void => {
                    dispatch(setAppIsLoading(true));

                    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

                    deleteRecordAction(id)
                        .then(() => {
                            displaySuccess("Payment record successfully deleted", false);
                        })
                        .then(getPaymentRecords)
                        .then(payments => {
                            dispatch(setPayments(payments));
                            dispatch(setAppIsLoading(false));
                        })
                        .catch(displayError);
                },
        }));
};
