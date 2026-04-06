import { AppThunkAction, AppThunkDispatch, createModalCallback } from "@app/redux/createAppAsyncThunk";
import { CompositeAppState } from "@app/redux";
import { getNotifications } from "@app/redux/notificator";
import { openModal, ModalType } from "@app/redux/modal";
import { setPayments } from "@app/redux/payments";

import { deletePaymentFile as deletePaymentFileAction, getPaymentRecords } from "@app/core/payment";

/**
 * Delete an attached payment file via confirmation modal
 */
export const deletePaymentFile = (fileId: string, fileName: string): AppThunkAction => (
    dispatch: AppThunkDispatch,
    getState: () => CompositeAppState,
): void => {
    if (!fileId) {
        const [, showError] = getNotifications(dispatch, getState);
        showError(new Error("Payment file id is not provided"), false);
        return;
    }

    dispatch(
        openModal({
            modalType: ModalType.Confirm,
            title: "Confirm deleting file",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure you want to delete the attached file "${fileName}"?`,
            callback: createModalCallback(dispatch, getState, async ({ showSuccess }) => {
                await deletePaymentFileAction(fileId);
                showSuccess("File successfully deleted", false);
                const payments = await getPaymentRecords();
                dispatch(setPayments(payments));
            }),
        })
    );
};
