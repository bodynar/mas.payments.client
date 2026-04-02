import { createAppAsyncThunk } from "@app/redux";
import { setTemplates } from "@app/redux/payments";

import { addTemplate, getTemplates, updateTemplate } from "@app/core/payment";
import { AddPaymentGroupTemplate, UpdatePaymentGroupTemplate } from "@app/models/payments";

/**
 * Save (create or update) a payment group template
 */
export const saveTemplate = createAppAsyncThunk(
    async ({ dispatch, showSuccess }, model: AddPaymentGroupTemplate | UpdatePaymentGroupTemplate) => {
        const isUpdate = "id" in model;

        if (isUpdate) {
            await updateTemplate(model as UpdatePaymentGroupTemplate);
            showSuccess("Template successfully updated", false);
        } else {
            await addTemplate(model);
            showSuccess("Template successfully created", false);
        }

        const templates = await getTemplates();
        dispatch(setTemplates(templates));

        return true;
    }
);
