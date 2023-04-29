import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetPaymentsAction } from "@app/redux/payments";
import { displayError } from "@app/redux/notificator";

import { getPaymentRecords } from "@app/core/payment";

/**
 * Load all payments
 * @returns Action function that can be called with redux dispatcher
 */
export const loadPayments = (): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));

    return getPaymentRecords()
        .then(payments => {
            dispatch(getSetPaymentsAction(payments));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(displayError(dispatch, getState));
};
