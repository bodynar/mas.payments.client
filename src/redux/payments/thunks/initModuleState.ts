import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setPaymentTypes, setModuleInitializedState, setPayments } from "@app/redux/payments";
import { setAppIsLoading } from "@app/redux/app/";
import { getNotifications } from "@app/redux/notificator";

import { getPaymentRecords, getPaymentTypes } from "@app/core/payment";
import { PaymentType } from "@app/models/payments";

/**
 * Init payments module state
 * @returns Action function that can be called with redux dispatcher
 */
export const initModuleState = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    dispatch(setAppIsLoading(true));

    const { payments } = getState();

    const paymentTypeProvider: Promise<Array<PaymentType>> =
        payments.availableTypesAsDropdownItems.length > 0
            ? new Promise(x => x(payments.availableTypes))
            : getPaymentTypes();

    const [_, displayError] = getNotifications(dispatch, getState);

    return void Promise.all([
        paymentTypeProvider,
        getPaymentRecords(),
    ])
        .then(([types, payments]) => {
            dispatch(setPaymentTypes(types));
            dispatch(setPayments(payments));

            dispatch(setModuleInitializedState(true));
            dispatch(setAppIsLoading(false));
        })
        .catch(displayError);
};
