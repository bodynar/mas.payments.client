import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState, getDisplayErrorMessageAction, getDisplaySuccessMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetMeasurementTypesAction } from "@app/redux/measurements";

import { getMeasurementTypes, saveTypeCard as saveCardAction } from "@app/core/measurement";

/**
 * Save current card values
 * @returns Action function that can be called with redux dispatcher
 */
export const saveTypeCard = (values: Array<FieldValue>, id?: string): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => async (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));

    await saveCardAction(values, id);

    getDisplaySuccessMessageAction(dispatch, getState)("Measurement type successfully saved");

    return getMeasurementTypes()
        .then(items => {
            dispatch(getSetMeasurementTypesAction(items));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};
