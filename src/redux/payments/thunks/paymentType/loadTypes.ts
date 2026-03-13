import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { PaymentType } from "@app/models/payments";

import { getPaymentTypes } from "@app/core/payment";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { setPaymentTypes } from "@app/redux/payments";
import { getNotifications } from "@app/redux/notificator";

/**
 * Load available payment types
 * @returns Action function that can be called with redux dispatcher
 */
export const loadTypes = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    dispatch(setAppIsLoading(true));

    const { payments } = getState();

    const paymentTypeProvider: Promise<Array<PaymentType>> =
        payments.typesMap.size > 0
            ? new Promise(x => x([...payments.typesMap.values()]))
            : getPaymentTypes();

    const [_, displayError] = getNotifications(dispatch, getState);

    return void paymentTypeProvider
        .then((types) => {
            dispatch(setPaymentTypes(types));
            dispatch(setAppIsLoading(false));
        })
        .catch(displayError);
};
