import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { setPaymentTypes } from "@app/redux/payments";
import { getNotifications } from "@app/redux/notificator";

import { getPaymentTypes, saveTypeCard as saveCardAction } from "@app/core/payment";

/**
 * Save current card values
 * @returns Action function that can be called with redux dispatcher
 */
export const saveTypeCard = (values: Array<FieldValue>, id?: string): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(setAppIsLoading(true));

    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

    return saveCardAction(values, id)
        .then(() => {
            displaySuccess("Payment type successfully saved", false);
        })
        .then(getPaymentTypes)
        .then(items => {
            dispatch(setPaymentTypes(items));
            dispatch(setAppIsLoading(false));
        })
        .catch(displayError);
};
