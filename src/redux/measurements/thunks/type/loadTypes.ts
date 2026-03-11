import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { MeasurementType } from "@app/models/measurements";

import { getMeasurementTypes } from "@app/core/measurement";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { setMeasurementTypes } from "@app/redux/measurements";
import { getNotifications } from "@app/redux/notificator";

/**
 * Load available measurement types
 * @returns Action function that can be called with redux dispatcher
 */
export const loadTypes = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    dispatch(setAppIsLoading(true));

    const { measurements } = getState();

    const paymentTypeProvider: Promise<Array<MeasurementType>> =
        measurements.availableTypesAsDropdownItems.length > 0
            ? new Promise(x => x(measurements.availableTypes))
            : getMeasurementTypes();

    const [_, displayError] = getNotifications(dispatch, getState);

    return void paymentTypeProvider
        .then((types) => {
            dispatch(setMeasurementTypes(types));
            dispatch(setAppIsLoading(false));
        })
        .catch(displayError);
};
