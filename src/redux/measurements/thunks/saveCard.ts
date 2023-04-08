import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { isNullOrUndefined } from "@bodynarf/utils";
import { ActionWithPayload, FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState, getDisplayErrorMessageAction, getDisplaySuccessMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetMeasurementsAction } from "@app/redux/measurements";

import { getMeasurements, createMeasurements, updateMeasurement } from "@app/core/measurement";
import { AddMeasurements } from "@app/models/measurements";

/**
 * Save current card values
 * @returns Action function that can be called with redux dispatcher
 */
export const saveCard = (values: Array<FieldValue> | AddMeasurements, id?: string): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => async (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));

    try {
        if (isNullOrUndefined(id)) {
            await createMeasurements(values as AddMeasurements);
        } else {
            await updateMeasurement(values as Array<FieldValue>, id!);
        }
    } catch (error: any) {
        getDisplayErrorMessageAction(dispatch, getState)(error);
        dispatch(getSetAppIsLoadingAction(false));

        return new Promise((_, reject) => reject(error as string));
    }

    getDisplaySuccessMessageAction(dispatch, getState)("Measurement records successfully saved");

    return getMeasurements()
        .then(items => {
            dispatch(getSetMeasurementsAction(items));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};
