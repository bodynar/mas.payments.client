import { isUndefined, getPropertyValueWithCheck, isNullOrUndefined, getPropertyValue, isNullOrEmpty } from "@bodynarf/utils";

import { SelectableItem } from "@bodynarf/react.components";

import { PaymentType, Payment, PaymentFilter } from "@app/models/payments";
import SortColumn from "@app/models/sortColumn";

import { sort } from "@app/utils";

import { ActionWithPayload } from "@app/redux";
import { FILTER_PAYMENTS, SET_PAYMENT_FILTER_VALUE, SET_MODULE_INITIALIZED_STATE, SET_PAYMENTS, SET_PAYMENT_TYPES, SET_PAYMENT_SORT_COLUMN, PaymentModuleState, filterPaymentList, SET_TYPE_SORT_COLUMN, FILTER_PAYMENT_TYPES, TOGGLE_GROUP_VIEW } from "@app/redux/payments";

/** Initial module state */
const defaultState: PaymentModuleState = {
    initialized: false,
    useGroupedView: false,
    payments: [],
    filteredItems: [],
    availableTypes: [],
    availableTypesAsDropdownItems: [],
    filteredTypes: [],
};

/**
 * Update module state depending on dispatched action
 * @param state Current state
 * @param action Dispatched action
 * @returns Updated state
 */
export default function (state: PaymentModuleState = defaultState, action: ActionWithPayload): PaymentModuleState {
    switch (action.type) {
        case SET_PAYMENTS: {
            const payments = getPropertyValueWithCheck<Array<Payment>>(action.payload, "payments", true);

            const filteredItems = isNullOrUndefined(state.lastFilter) ? payments : filterPaymentList(payments, state.lastFilter);

            return {
                ...state,
                payments,
                filteredItems: filteredItems,
            };
        }
        case SET_PAYMENT_FILTER_VALUE: {
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
        case SET_PAYMENT_TYPES: {
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
                filteredTypes: types,
            };
        }
        case SET_MODULE_INITIALIZED_STATE: {
            const isInitialized = getPropertyValueWithCheck<boolean | undefined>(action.payload, "isInitialized", false) || undefined;

            return isUndefined(isInitialized)
                ? state
                : {
                    ...state,
                    initialized: isInitialized!,
                };
        }
        case FILTER_PAYMENTS: {
            const displayedItems = filterPaymentList(state.payments, state.lastFilter);

            return {
                ...state,
                filteredItems: displayedItems,
            };
        }
        case SET_PAYMENT_SORT_COLUMN: {
            const sortColumn = getPropertyValueWithCheck<SortColumn<Payment>>(action.payload, "sortColumn", true);

            const sortedPayments = sort(state.filteredItems, sortColumn);

            return {
                ...state,
                paymentSortColumn: sortColumn,
                filteredItems: sortedPayments,
            };
        }
        case SET_TYPE_SORT_COLUMN: {
            const sortColumn = getPropertyValueWithCheck<SortColumn<PaymentType>>(action.payload, "sortColumn", true);

            const sortedItems = sort(state.availableTypes, sortColumn);

            return {
                ...state,
                paymentTypeSortColumn: sortColumn,
                availableTypes: sortedItems,
                filteredTypes: state.availableTypes.filter(({ caption }) => caption.toLocaleLowerCase().includes(state.typeFilterCaption?.toLocaleLowerCase() ?? "")),
            };
        }
        case FILTER_PAYMENT_TYPES: {
            const filterValue = getPropertyValue<string | undefined>(action.payload, "name");

            if (isNullOrEmpty(filterValue)) {
                return {
                    ...state,
                    filteredTypes: state.availableTypes,
                };
            }

            const loweredValue = filterValue!.toLocaleLowerCase();

            return {
                ...state,
                filteredTypes: state.availableTypes.filter(({ caption }) => caption.toLocaleLowerCase().includes(loweredValue)),
                typeFilterCaption: filterValue!,
            };
        }
        case TOGGLE_GROUP_VIEW: {
            return {
                ...state,
                useGroupedView: !state.useGroupedView,
            };
        }
        default: {
            return state;
        }
    }
}
