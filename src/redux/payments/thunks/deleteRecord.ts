import { deleteRecord as deleteRecordAction, getPaymentRecords } from "@app/core/payment";
import { getMonthName } from "@app/utils";

import { AppThunkAction, AppThunkDispatch, createModalCallback } from "@app/redux/createAppAsyncThunk";
import { CompositeAppState } from "@app/redux";
import { openModal, ModalType } from "@app/redux/modal";
import { setPayments } from "@app/redux/payments";

/**
 * Delete specified payment via confirmation modal
 */
export const deleteRecord = (id: number): AppThunkAction => (
    dispatch: AppThunkDispatch,
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
            callback: createModalCallback(dispatch, getState, async ({ showSuccess }) => {
                await deleteRecordAction(id);
                showSuccess("Payment record successfully deleted", false);
                const items = await getPaymentRecords();
                dispatch(setPayments(items));
            }),
        })
    );
};
