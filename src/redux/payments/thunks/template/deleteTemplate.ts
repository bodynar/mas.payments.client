import { AppThunkAction, AppThunkDispatch, createModalCallback } from "@app/redux/createAppAsyncThunk";
import { CompositeAppState } from "@app/redux";
import { openModal, ModalType } from "@app/redux/modal";
import { setTemplates } from "@app/redux/payments";

import { deleteTemplate as deleteTemplateAction, getTemplates } from "@app/core/payment";

/**
 * Delete specified payment group template via confirmation modal
 */
export const deleteTemplate = (id: string): AppThunkAction => (
    dispatch: AppThunkDispatch,
    getState: () => CompositeAppState,
): void => {
    const { payments } = getState();
    const template = payments.templatesMap.get(id);

    dispatch(
        openModal({
            modalType: ModalType.Confirm,
            title: "Confirm deleting template",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure you want to delete template "${template?.name ?? "this template"}"?`,
            callback: createModalCallback(dispatch, getState, async ({ showSuccess }) => {
                await deleteTemplateAction(id);
                showSuccess("Template successfully deleted", false);
                const templates = await getTemplates();
                dispatch(setTemplates(templates));
            }),
        })
    );
};
