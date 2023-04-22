import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, CompositeAppState, getDisplayErrorMessageAction, getDisplaySuccessMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getOpenModalAction, ModalType } from "@app/redux/modal";
import { getSetPaymentsAction } from "@app/redux/payments";

import { deleteRecord as deleteRecordAction, getPaymentRecords } from "@app/core/payment";
import { getMonthName } from "@app/constants";

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
                saveCallback: async (): Promise<void> => {
                    dispatch(getSetAppIsLoadingAction(true));

                    await deleteRecordAction(id);

                    getDisplaySuccessMessageAction(dispatch, getState, false)("Payment record successfully deleted");

                    getPaymentRecords()
                        .then(payments => {
                            dispatch(getSetPaymentsAction(payments));
                            dispatch(getSetAppIsLoadingAction(false));
                        })
                        .catch(getDisplayErrorMessageAction(dispatch, getState));
                },
                cancelCallback: (): void => { }
            }
        }));
};
