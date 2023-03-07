import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { CompositeAppState, ActionWithPayload, getDisplayErrorMessageAction } from "@app/redux";
import { getSetPaymentTypesAction, getSetModuleInitializedStateAction, getSetPaymentsAction } from "@app/redux/payments";
import { getSetAppIsLoadingAction } from "@app/redux/app/";

import { getPaymentRecords, getPaymentTypes } from "@app/core/payment";

/**
 * Init payments module state
 * @returns Action function that can be called with redux dispatcher
 */
export const initModuleState = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    dispatch(getSetAppIsLoadingAction(true));

    Promise.all([
        getPaymentTypes(),
        getPaymentRecords(),
    ])
        .then(([types, payments]) => {
            dispatch(getSetPaymentTypesAction(types));
            dispatch(getSetPaymentsAction(payments));

            dispatch(getSetModuleInitializedStateAction(true));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};
