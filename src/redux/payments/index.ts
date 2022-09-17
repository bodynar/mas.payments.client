import { getPropertyValueWithCheck } from "@bodynarf/utils/object";

import { SelectableItem } from "@bodynarf/react.components/components/dropdown/types";

import { PaymentType, Payment, PaymentFilter } from "@app/models/payments";

import { ActionWithPayload } from "../types";
import { setFilterValue, setModuleInitializedState, setPayments, setPaymentTypes } from "./actions";

import { PaymentModuleState } from "./types";
import { isUndefined } from "@bodynarf/utils";

/** Initial module state */
const defaultState: PaymentModuleState = {
    initialized: false,
    payments: [],
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
                payments
            };
        }
        case setFilterValue: {
            const filter = getPropertyValueWithCheck<PaymentFilter>(action.payload, 'filter', true);

            return {
                ...state,
                lastFilter: filter,
            };
        }
        case setPaymentTypes: {
            const types = getPropertyValueWithCheck<Array<PaymentType>>(action.payload, 'types', true);

            const mappedToDropdownItems = types.map(({ id, caption, name }) => ({
                id: id.toString(),
                displayValue: caption,
                value: name,
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
                : ({
                    ...state,
                    initialized: isInitialized!,
                });
        }
        default: {
            return state;
        }
    }
}
