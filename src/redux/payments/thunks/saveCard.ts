import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSetPaymentsAction } from "@app/redux/payments";
import { getNotifications } from "@app/redux/notificator";

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

    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

    return saveCardAction(values, id)
        .then(() => {
            displaySuccess("Payment record successfully saved", false);
        })
        .then(getPaymentRecords)
        .then(payments => {
            dispatch(getSetPaymentsAction(payments));
            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(displayError);
};
