import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { setMeasurementTypes } from "@app/redux/measurements";
import { getNotifications } from "@app/redux/notificator";

import { getMeasurementTypes, saveTypeCard as saveCardAction } from "@app/core/measurement";

/**
 * Save current card values
 * @returns Action function that can be called with redux dispatcher
 */
export const saveTypeCard = (values: Array<FieldValue>, id?: string): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(setAppIsLoading(true));

    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

    return saveCardAction(values, id)
        .then(() => {
            displaySuccess("Measurement type successfully saved", false);
        })
        .then(getMeasurementTypes)
        .then(types => {
            dispatch(setMeasurementTypes(types));
            dispatch(setAppIsLoading(false));
        })
        .catch(displayError);
};
