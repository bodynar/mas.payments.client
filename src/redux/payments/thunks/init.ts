import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { get } from "@app/utils";

import { CompositeAppState, ActionWithPayload, getDisplayErrorMessageAction } from "@app/redux";
import { getSetPaymentTypesAction, getSetPaymentsAction, getSetModuleInitializedStateAction } from "@app/redux/payments";
import { getSetAppIsLoadingAction } from "@app/redux/app/";

import { PaymentType, Payment } from "@app/models/payments";

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
        loadPaymentTypes(dispatch, getState),
        loadPayments(dispatch, getState),
    ])
        .then(() => {
            dispatch(getSetModuleInitializedStateAction(true));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};

/**
 * Get load all payment types promise and save it into state
 * @returns Load all payment types promise
 */
const loadPaymentTypes = (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    return get<Array<any>>(`api/payment/getPaymentTypes`)
        .then((types: Array<any>) => {
            dispatch(
                getSetPaymentTypesAction(
                    types.map(x => ({
                        ...x,
                        // id: x["id"],
                        name: x["systemName"],
                        caption: x["name"],
                        // hasRelatedMeasurementTypes: x["hasRelatedMeasurementTypes"],
                        // hasRelatedPayments: x["hasRelatedPayments"],

                        // color: x["color"],
                        // company: x["company"],
                        // description: x["description"],
                    }) as PaymentType)
                )
            );

        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};

/**
 * Get load all payments promise and save it into state
 * @returns Load all payments promise
 */
const loadPayments = (
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
