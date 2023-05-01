import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { deleteRecord as deleteRecordAction, getPaymentRecords } from "@app/core/payment";
import { getMonthName } from "@app/utils";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getOpenModalAction, ModalType } from "@app/redux/modal";
import { getSetPaymentsAction } from "@app/redux/payments";
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
        getOpenModalAction({
            modalType: ModalType.Confirm,
            title: "Confirm deleting payment",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure want to delete payment record for ${getMonthName(payment.month)} ${payment.year}?`,
            callback: {
                saveCallback: (): void => {
                    dispatch(getSetAppIsLoadingAction(true));

                    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

                    deleteRecordAction(id)
                        .then(() => {
                            displaySuccess("Payment record successfully deleted", false);
                        })
                        .then(getPaymentRecords)
                        .then(payments => {
                            dispatch(getSetPaymentsAction(payments));
                            dispatch(getSetAppIsLoadingAction(false));
                        })
                        .catch(displayError);
                },
            }
        }));
};
