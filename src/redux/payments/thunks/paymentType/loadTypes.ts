import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { CompositeAppState, ActionWithPayload, getDisplayErrorMessageAction } from "@app/redux";
import { getSetPaymentTypesAction } from "@app/redux/payments";
import { getSetAppIsLoadingAction } from "@app/redux/app/";

import { getPaymentTypes } from "@app/core/payment";
import { PaymentType } from "@app/models/payments";

/**
 * Load available payment types
 * @returns Action function that can be called with redux dispatcher
 */
export const loadTypes = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    dispatch(getSetAppIsLoadingAction(true));

    const { payments } = getState();

    const paymentTypeProvider: Promise<Array<PaymentType>> =
        payments.availableTypesAsDropdownItems.length > 0
            ? new Promise(x => x(payments.availableTypes))
            : getPaymentTypes();

    paymentTypeProvider
        .then((types) => {
            dispatch(getSetPaymentTypesAction(types));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};
