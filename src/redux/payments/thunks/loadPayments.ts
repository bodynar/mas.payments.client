import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { get } from "@app/utils";

import { CompositeAppState, ActionWithPayload, getDisplayErrorMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetPaymentsAction } from "@app/redux/payments";

import { Payment } from "@app/models/payments";

/**
 * Load all payments
 * @returns Action function that can be called with redux dispatcher
 */
export const loadPayments = (): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));

    return loadPaymentsAndSaveInStorage(dispatch, getState)
        .then(() => {
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};

/**
 * Get load all payments promise and save it into state
 * @returns Load all payments promise
 */
const loadPaymentsAndSaveInStorage = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    return get<Array<any>>(`api/payment/getPayments`)
        .then((payments: Array<any>) => {
            dispatch(
                getSetPaymentsAction(
                    payments.map(x => ({
                        ...x,

                        price: x["amount"],
                        month: x["dateMonth"],
                        year: x["dateYear"],

                        typeId: x["paymentTypeId"],
                        typeCaption: x["paymentTypeName"],
                        typeColor: x["paymentTypeColor"],
                    }) as Payment)
                )
            );

        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};
