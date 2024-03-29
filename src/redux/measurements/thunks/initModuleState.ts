import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { getMeasurements, getMeasurementTypes } from "@app/core/measurement";
import { getPaymentTypes } from "@app/core/payment";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { getSetMeasurementTypesAction, getSetModuleInitializedStateAction, getSetMeasurementsAction } from "@app/redux/measurements";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetPaymentTypesAction } from "@app/redux/payments";
import { getNotifications } from "@app/redux/notificator";

/**
 * Init measurements module state
 * @returns Action function that can be called with redux dispatcher
 */
export const initModuleState = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    dispatch(getSetAppIsLoadingAction(true));

    const [_, displayError] = getNotifications(dispatch, getState);

    Promise.all([
        getMeasurementTypes(),
        getMeasurements(),
        getPaymentTypes(),
    ])
        .then(([types, measurements, paymentTypes]) => {
            dispatch(getSetMeasurementTypesAction(types));
            dispatch(getSetMeasurementsAction(measurements));
            dispatch(getSetPaymentTypesAction(paymentTypes));

            dispatch(getSetModuleInitializedStateAction(true));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(displayError);
};
