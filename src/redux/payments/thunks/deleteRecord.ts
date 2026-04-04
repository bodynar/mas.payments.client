import { deleteRecord as deleteRecordAction, getPaymentRecords } from "@app/core/payment";
import { getMonthName } from "@app/utils";

import { AppThunkAction, AppThunkDispatch, createModalCallback } from "@app/redux/createAppAsyncThunk";
import { CompositeAppState } from "@app/redux";
import { getNotifications } from "@app/redux/notificator";
import { openModal, ModalType } from "@app/redux/modal";
import { setPayments } from "@app/redux/payments";

/**
 * Delete specified payment via confirmation modal
 */
export const deleteRecord = (id: string): AppThunkAction => (
    dispatch: AppThunkDispatch,
    getState: () => CompositeAppState
): void => {
    const { payments } = getState();
    const payment = payments.records.find((x) => x.id === id);

    if (!payment) {
        const [, showError] = getNotifications(dispatch, getState);
        showError(new Error(`Payment with id "${id}" not found in local state`), false);
        return;
    }

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
