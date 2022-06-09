import { getPropertyValueWithCheck } from "@bodynarf/utils/object";

import { ActionWithPayload } from "../types";
import { SetIsAppLoadingState, SetTabIsFocused } from "./actions";

import { AppState } from "./types";

const defaultState: AppState = {
    isCurrentTabFocused: true,
    loading: false
};

/**
 * Update application state depending on dispatched action
 * @param state Current state
 * @param action Dispatched action
 * @returns Updated state
 */
export default function (state: AppState = defaultState, action: ActionWithPayload): AppState {
    switch (action.type) {
        case SetTabIsFocused: {
            const isTabFocused: boolean =
                getPropertyValueWithCheck(action.payload, 'isTabFocused');

            return {
                ...state,
                isCurrentTabFocused: isTabFocused
            };
        }
        case SetIsAppLoadingState: {
            const isLoading: boolean =
                getPropertyValueWithCheck(action.payload, 'loading', false) || false;

            return {
                ...state,
                loading: isLoading
            };
        }
        default: {
            return state;
        }
    }
}
