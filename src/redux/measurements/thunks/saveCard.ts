import { isNullish } from "@bodynarf/utils";
import { FieldValue } from "@bodynarf/react.components.form";

import { createAppAsyncThunk } from "@app/redux";
import { setMeasurements } from "@app/redux/measurements";

import { getMeasurements, createMeasurements, updateMeasurement } from "@app/core/measurement";
import { AddMeasurements } from "@app/models/measurements";

/**
 * Save current card values
 */
export const saveCard = createAppAsyncThunk(
    async ({ dispatch, showSuccess }, values: Array<FieldValue> | AddMeasurements, id?: string): Promise<boolean> => {
        if (isNullish(id)) {
            await createMeasurements(values as AddMeasurements);
        } else {
            await updateMeasurement(values as Array<FieldValue>, id!);
        }

        showSuccess("Measurement records successfully saved", false);

        const items = await getMeasurements();
        dispatch(setMeasurements(items));
        return true;
    }
);
