import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { get } from "@app/utils/delayedApi";

import { CompositeAppState } from "@app/redux/rootReducer";
import { ActionWithPayload } from "@app/redux/types";
import { getDisplayErrorMessageAction } from "@app/redux/utils";

import { getSetAppIsLoadingAction } from "@app/redux/app/actionCreators/setAppIsLoading";

import { PaymentType, Payment } from "@app/models/payments";

import { getSetPaymentTypesAction } from "../actionCreators/setPaymentTypes";
import { getSetPaymentsAction } from "../actionCreators/setPayments";
import { getSetModuleInitializedStateAction } from "../actionCreators/setModuleInitializedState";

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
