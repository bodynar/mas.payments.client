import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState, getDisplayErrorMessageAction, getDisplaySuccessMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetPaymentsAction } from "@app/redux/payments";

import { getPaymentRecords, saveCard as saveCardAction } from "@app/core/payment";

/**
 * Save current card values
 * @returns Action function that can be called with redux dispatcher
 */
export const saveCard = (values: Array<FieldValue>, id?: string): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => async (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));

    await saveCardAction(values, id);

    getDisplaySuccessMessageAction(dispatch, getState, false)("Payment record successfully saved");

    return getPaymentRecords()
        .then(payments => {
            dispatch(getSetPaymentsAction(payments));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};
