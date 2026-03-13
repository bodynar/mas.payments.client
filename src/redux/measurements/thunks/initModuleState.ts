import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { getMeasurements, getMeasurementTypes } from "@app/core/measurement";
import { getPaymentTypes } from "@app/core/payment";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setMeasurementTypes, setModuleInitializedState, setMeasurements } from "@app/redux/measurements";
import { setAppIsLoading } from "@app/redux/app";
import { setPaymentTypes } from "@app/redux/payments";
import { getNotifications } from "@app/redux/notificator";

/**
 * Init measurements module state
 * @returns Action function that can be called with redux dispatcher
 */
export const initModuleState = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    dispatch(setAppIsLoading(true));

    const [_, displayError] = getNotifications(dispatch, getState);

    return void Promise.all([
        getMeasurementTypes(),
        getMeasurements(),
        getPaymentTypes(),
    ])
        .then(([types, measurements, paymentTypes]) => {
            dispatch(setMeasurementTypes(types));
            dispatch(setMeasurements(measurements));
            dispatch(setPaymentTypes(paymentTypes));

            dispatch(setModuleInitializedState(true));
            dispatch(setAppIsLoading(false));
        })
        .catch(displayError);
};
