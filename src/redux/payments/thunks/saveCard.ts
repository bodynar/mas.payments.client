import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetPaymentsAction } from "@app/redux/payments";
import { displayError, displaySuccess } from "@app/redux/notificator";

import { getPaymentRecords, saveCard as saveCardAction } from "@app/core/payment";

/**
 * Save current card values
 * @returns Action function that can be called with redux dispatcher
 */
export const saveCard = (values: Array<FieldValue>, id?: string): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState,
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));

    return saveCardAction(values, id)
        .then(() => {
            displaySuccess(dispatch, getState, false)("Payment record successfully saved");
        })
        .then(getPaymentRecords)
        .then(payments => {
            dispatch(getSetPaymentsAction(payments));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(displayError(dispatch, getState));
};
