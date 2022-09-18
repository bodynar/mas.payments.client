import { isUndefined } from "@bodynarf/utils";
import { getPropertyValueWithCheck } from "@bodynarf/utils/object";

import { SelectableItem } from "@bodynarf/react.components/components/dropdown/types";

import { PaymentType, Payment, PaymentFilter } from "@app/models/payments";

import { ActionWithPayload } from "../types";

import { filterPayments, setFilterValue, setModuleInitializedState, setPayments, setPaymentTypes } from "./actions";
import { PaymentModuleState } from "./types";
import { filter } from "./utils/filter";

/** Initial module state */
const defaultState: PaymentModuleState = {
    initialized: false,
    payments: [],
    filteredItems: [],
    availableTypes: [],
    availableTypesAsDropdownItems: [],
};

/**
 * Update module state depending on dispatched action
 * @param state Current state
 * @param action Dispatched action
 * @returns Updated state
 */
export default function (state: PaymentModuleState = defaultState, action: ActionWithPayload): PaymentModuleState {
    switch (action.type) {
        case setPayments: {
            const payments = getPropertyValueWithCheck<Array<Payment>>(action.payload, 'payments', true);

            return {
                ...state,
                payments,
                filteredItems: payments,
            };
        }
        case setFilterValue: {
            const filterValue = getPropertyValueWithCheck<PaymentFilter>(action.payload, 'filter', false);

            return isUndefined(filterValue)
                ? {
                    ...state,
                    lastFilter: filterValue,
                    filteredItems: state.payments
                }
                : {
                    ...state,
                    lastFilter: filterValue,
                };
        }
        case setPaymentTypes: {
            const types = getPropertyValueWithCheck<Array<PaymentType>>(action.payload, 'types', true);

            const mappedToDropdownItems = types.map(({ id, caption }) => ({
                id: id.toString(),
                displayValue: caption,
                value: id.toString(),
            }) as SelectableItem);

            return {
                ...state,
                availableTypes: types,
                availableTypesAsDropdownItems: mappedToDropdownItems,
            };
        }
        case setModuleInitializedState: {
            const isInitialized = getPropertyValueWithCheck<boolean | undefined>(action.payload, 'isInitialized', false) || undefined;

            return isUndefined(isInitialized)
                ? state
                : {
                    ...state,
                    initialized: isInitialized!,
                };
        }
        case filterPayments: {
            const displayedItems = filter(state.payments, state.lastFilter);

            return {
                ...state,
                filteredItems: displayedItems,
            };
        }
        default: {
            return state;
        }
    }
}
