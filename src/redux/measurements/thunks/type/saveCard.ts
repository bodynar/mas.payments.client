import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetMeasurementTypesAction } from "@app/redux/measurements";
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
    dispatch(getSetAppIsLoadingAction(true));

    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

    return saveCardAction(values, id)
        .then(() => {
            displaySuccess("Measurement type successfully saved", false);
        })
        .then(getMeasurementTypes)
        .then(items => {
            dispatch(getSetMeasurementTypesAction(items));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(displayError);
};
