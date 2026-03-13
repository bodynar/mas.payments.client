import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { setPayments } from "@app/redux/payments";
import { getNotifications } from "@app/redux/notificator";

import { getPaymentRecords } from "@app/core/payment";

/**
 * Load all payments
 * @returns Action function that can be called with redux dispatcher
 */
export const loadPayments = (): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(setAppIsLoading(true));

    const [_, displayError] = getNotifications(dispatch, getState);

    return getPaymentRecords()
        .then(payments => {
            dispatch(setPayments(payments));
            dispatch(setAppIsLoading(false));
        })
        .catch(displayError);
};
