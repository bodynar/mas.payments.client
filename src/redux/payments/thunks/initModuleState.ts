import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { getSetPaymentTypesAction, getSetModuleInitializedStateAction, getSetPaymentsAction } from "@app/redux/payments";
import { getSetAppIsLoadingAction } from "@app/redux/app/";
import { displayError } from "@app/redux/notificator";

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
    dispatch(getSetAppIsLoadingAction(true));

    const { payments } = getState();

    const paymentTypeProvider: Promise<Array<PaymentType>> =
        payments.availableTypesAsDropdownItems.length > 0
            ? new Promise(x => x(payments.availableTypes))
            : getPaymentTypes();

    Promise.all([
        paymentTypeProvider,
        getPaymentRecords(),
    ])
        .then(([types, payments]) => {
            dispatch(getSetPaymentTypesAction(types));
            dispatch(getSetPaymentsAction(payments));

            dispatch(getSetModuleInitializedStateAction(true));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(displayError(dispatch, getState));
};
