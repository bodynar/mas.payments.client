import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { isNullOrUndefined } from "@bodynarf/utils";
import { ActionWithPayload, FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetMeasurementsAction } from "@app/redux/measurements";
import { getNotifications } from "@app/redux/notificator";

import { getMeasurements, createMeasurements, updateMeasurement } from "@app/core/measurement";
import { AddMeasurements } from "@app/models/measurements";

/**
 * Save current card values
 * @returns Action function that can be called with redux dispatcher
 */
export const saveCard = (values: Array<FieldValue> | AddMeasurements, id?: string): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));

    const action: () => Promise<void> =
        isNullOrUndefined(id)
            ? () => createMeasurements(values as AddMeasurements)
            : () => updateMeasurement(values as Array<FieldValue>, id!);

    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

    return action()
        .then(() => {
            displaySuccess("Measurement records successfully saved", false);
        })
        .then(getMeasurements)
        .then(items => {
            dispatch(getSetMeasurementsAction(items));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(displayError);
};
