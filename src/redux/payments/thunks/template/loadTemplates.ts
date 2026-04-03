import { createAppAsyncThunk } from "@app/redux";
import { setTemplates } from "@app/redux/payments";

import { getTemplates } from "@app/core/payment";

/**
 * Load all payment group templates
 */
export const loadTemplates = createAppAsyncThunk(
    async ({ dispatch }) => {
        const templates = await getTemplates();
        dispatch(setTemplates(templates));
    }
);
