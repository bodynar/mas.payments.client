import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { MeasurementType } from "@app/models/measurements";

import { getMeasurementTypes } from "@app/core/measurement";

import { CompositeAppState, ActionWithPayload, getDisplayErrorMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetMeasurementTypesAction } from "@app/redux/measurements";

/**
 * Load available measurement types
 * @returns Action function that can be called with redux dispatcher
 */
export const loadTypes = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    dispatch(getSetAppIsLoadingAction(true));

    const { measurements } = getState();

    const paymentTypeProvider: Promise<Array<MeasurementType>> =
        measurements.availableTypesAsDropdownItems.length > 0
            ? new Promise(x => x(measurements.availableTypes))
            : getMeasurementTypes();

    paymentTypeProvider
        .then((types) => {
            dispatch(getSetMeasurementTypesAction(types));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};
