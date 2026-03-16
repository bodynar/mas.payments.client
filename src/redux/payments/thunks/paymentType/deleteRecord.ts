import { AppThunkAction, AppThunkDispatch, createModalCallback } from "@app/redux/createAppAsyncThunk";
import { CompositeAppState } from "@app/redux";
import { openModal, ModalType } from "@app/redux/modal";
import { setPaymentTypes } from "@app/redux/payments";

import { deleteTypeRecord as deleteRecordAction, getPaymentTypes } from "@app/core/payment";

/**
 * Delete specified payment type via confirmation modal
 */
export const deleteTypeRecord = (id: number): AppThunkAction => (
    dispatch: AppThunkDispatch,
    getState: () => CompositeAppState,
): void => {
    const { payments } = getState();
    const paymentType = payments.typesMap.get(id)!;

    dispatch(
        openModal({
            modalType: ModalType.Confirm,
            title: "Confirm deleting payment type",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure you want to delete payment type ${paymentType.caption}?`,
            callback: createModalCallback(dispatch, getState, async ({ showSuccess }) => {
                await deleteRecordAction(id);
                showSuccess("Payment type successfully deleted", false);
                const items = await getPaymentTypes();
                dispatch(setPaymentTypes(items));
            }),
        })
    );
};
