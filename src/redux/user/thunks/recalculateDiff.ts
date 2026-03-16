import { isNullish } from "@bodynarf/utils";

import { createAppAsyncThunk } from "@app/redux";
import { openModal, ModalType } from "@app/redux/modal";

import { recalculateMeasurementDiff } from "@app/core/measurement";

/**
 * Recalculate measurements diff
 */
export const recalculateDiff = createAppAsyncThunk(
    async ({ dispatch, showSuccess }): Promise<boolean> => {
        const result = await recalculateMeasurementDiff();

        if (isNullish(result) || result.length === 0) {
            showSuccess("Diff successfully recalculated", false);
            return true;
        }

        dispatch(openModal({
            modalType: ModalType.Info,
            title: "Recalculate error",
            message: result.join("\n")
        }));

        return false;
    }
);
