import { isUndefined, getPropertyValueWithCheck, isNullOrUndefined } from "@bodynarf/utils";

import { SelectableItem } from "@bodynarf/react.components";

import { PaymentType, Payment, PaymentFilter } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

import { sort } from "@app/utils";

import { ActionWithPayload } from "@app/redux";
import { filterPayments, setPaymentFilterValue, setModuleInitializedState, setPayments, setPaymentTypes, setPaymentSortColumn, PaymentModuleState, filterPaymentList, setTypeSortColumn } from "@app/redux/payments";

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
            const payments = getPropertyValueWithCheck<Array<Payment>>(action.payload, "payments", true);

            const filteredItems = isNullOrUndefined(state.lastFilter) ? payments : filterPaymentList(payments, state.lastFilter);

            return {
                ...state,
                payments,
                filteredItems: filteredItems,
            };
        }
        case setPaymentFilterValue: {
            const filterValue = getPropertyValueWithCheck<PaymentFilter>(action.payload, "filter", false);
            const applyFilter = getPropertyValueWithCheck<boolean>(action.payload, "applyFilter", false);

            return isUndefined(filterValue)
                ? {
                    ...state,
                    lastFilter: filterValue,
                    filteredItems: state.payments
                }
                : {
                    ...state,
                    lastFilter: filterValue,
                    filteredItems: !applyFilter ? state.filteredItems : filterPaymentList(state.payments, filterValue)
                };
        }
        case setPaymentTypes: {
            const types = getPropertyValueWithCheck<Array<PaymentType>>(action.payload, "types", true);

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
            const isInitialized = getPropertyValueWithCheck<boolean | undefined>(action.payload, "isInitialized", false) || undefined;

            return isUndefined(isInitialized)
                ? state
                : {
                    ...state,
                    initialized: isInitialized!,
                };
        }
        case filterPayments: {
            const displayedItems = filterPaymentList(state.payments, state.lastFilter);

            return {
                ...state,
                filteredItems: displayedItems,
            };
        }
        case setPaymentSortColumn: {
            const sortColumn = getPropertyValueWithCheck<SortColumn<Payment>>(action.payload, "sortColumn", true);

            const sortedPayments = sort(state.filteredItems, sortColumn);

            return {
                ...state,
                paymentSortColumn: sortColumn,
                filteredItems: sortedPayments,
            };
        }
        case setTypeSortColumn: {
            const sortColumn = getPropertyValueWithCheck<SortColumn<PaymentType>>(action.payload, "sortColumn", true);

            const sortedItems = sort(state.availableTypes, sortColumn);

            return {
                ...state,
                paymentTypeSortColumn: sortColumn,
                availableTypes: sortedItems,
            };
        }

        default: {
            return state;
        }
    }
}
