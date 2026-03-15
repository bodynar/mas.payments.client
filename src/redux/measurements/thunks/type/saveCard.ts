import { FieldValue } from "@bodynarf/react.components.form";

import { createAppAsyncThunk } from "@app/redux";
import { setMeasurementTypes } from "@app/redux/measurements";

import { getMeasurementTypes, saveTypeCard as saveCardAction } from "@app/core/measurement";

/**
 * Save current measurement type card values
 */
export const saveTypeCard = createAppAsyncThunk(
    async ({ dispatch, showSuccess }, values: Array<FieldValue>, id?: string) => {
        await saveCardAction(values, id);
        showSuccess("Measurement type successfully saved", false);

        const types = await getMeasurementTypes();
        dispatch(setMeasurementTypes(types));
    }
);
