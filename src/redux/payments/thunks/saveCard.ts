import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, FieldValue } from "@bodynarf/react.components.form";

import { CompositeAppState, getDisplayErrorMessageAction, getDisplaySuccessMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";

import { saveCard as saveCardAction } from "@app/core/payment";

/**
 * Save current card values
 * @returns Action function that can be called with redux dispatcher
 */
export const saveCard = (values: Array<FieldValue>, id?: string): ThunkAction<Promise<void>, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));

    return saveCardAction(values, id)
        .then(() => {
            dispatch(getSetAppIsLoadingAction(false));
            getDisplaySuccessMessageAction(dispatch, getState)("Payement successfully saved");
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};
