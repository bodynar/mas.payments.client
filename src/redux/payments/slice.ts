import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { isNullOrEmpty, isUndefined, isNullish } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";

import { PaymentType, Payment, PaymentFilter, PaymentGroupTemplate } from "@app/models/payments";
import { SortColumn } from "@app/models";

import { sort } from "@app/utils";
import { filterEntities } from "@app/core";

import { PaymentModuleState } from "./types";

const initialState: PaymentModuleState = {
    initialized: false,
    useGroupedView: false,
    payments: [],
    filteredItems: [],
    typesMap: new Map(),
    availableTypesAsDropdownItems: [],
    filteredTypes: [],
    templatesMap: new Map(),
    templatesAsDropdownItems: new Map(),
    templatesLoaded: false,
};

const paymentsSlice = createSlice({
    name: "mas.payments/payment",
    initialState,
    reducers: {
        setPayments(state, action: PayloadAction<Payment[]>) {
            const payments = action.payload;
            state.payments = payments;
            state.filteredItems = isNullish(state.lastFilter)
                ? payments
                : filterEntities(payments, state.lastFilter);
        },
        setFilterValue: {
            reducer(state, action: PayloadAction<{ filter?: PaymentFilter; applyFilter: boolean }>) {
                const { filter, applyFilter } = action.payload;

                if (isUndefined(filter)) {
                    state.lastFilter = filter;
                    state.filteredItems = state.payments;
                } else {
                    state.lastFilter = filter;
                    if (applyFilter) {
                        state.filteredItems = filterEntities(state.payments, filter);
                    }
                }
            },
            prepare(filter?: PaymentFilter, applyFilter: boolean = false) {
                return { payload: { filter, applyFilter } };
            },
        },
        setPaymentTypes(state, action: PayloadAction<PaymentType[]>) {
            const types = action.payload;
            const mappedToDropdownItems = types.map(({ id, caption }) => ({
                id: id.toString(),
                displayValue: caption,
                value: id.toString(),
            }) as SelectableItem);

            state.typesMap = new Map(types.map(t => [t.id, t]));
            state.availableTypesAsDropdownItems = mappedToDropdownItems;
            state.filteredTypes = types;
        },
        setModuleInitializedState(state, action: PayloadAction<boolean>) {
            if (!isUndefined(action.payload)) {
                state.initialized = action.payload;
            }
        },
        filterPayments(state) {
            state.filteredItems = filterEntities(state.payments, state.lastFilter);
        },
        setSortColumn(state, action: PayloadAction<SortColumn<Payment>>) {
            state.paymentSortColumn = action.payload;
            state.filteredItems = sort(state.filteredItems, action.payload);
        },
        setTypeSortColumn(state, action: PayloadAction<SortColumn<PaymentType>>) {
            const sortColumn = action.payload;
            state.paymentTypeSortColumn = sortColumn;
            const allTypes = sort([...state.typesMap.values()], sortColumn);
            state.filteredTypes = allTypes.filter(
                ({ caption }) => caption.toLocaleLowerCase().includes(state.typeFilterCaption?.toLocaleLowerCase() ?? "")
            );
        },
        filterPaymentTypes(state, action: PayloadAction<string | undefined>) {
            const filterValue = action.payload;
            const allTypes = state.paymentTypeSortColumn
                ? sort([...state.typesMap.values()], state.paymentTypeSortColumn)
                : [...state.typesMap.values()];

            if (isNullOrEmpty(filterValue)) {
                state.filteredTypes = allTypes;
                return;
            }

            const lowered = filterValue!.toLocaleLowerCase();
            state.filteredTypes = allTypes.filter(
                ({ caption }) => caption.toLocaleLowerCase().includes(lowered)
            );
            state.typeFilterCaption = filterValue!;
        },
        toggleGroupView(state) {
            state.useGroupedView = !state.useGroupedView;
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.lastPage = action.payload;
        },
        setTemplates(state, action: PayloadAction<PaymentGroupTemplate[]>) {
            state.templatesMap = new Map(action.payload.map(t => [t.id, t]));
            state.templatesAsDropdownItems = new Map(action.payload.map(t => [t.id, {
                id: t.id,
                displayValue: t.name,
                value: t.id,
            } as SelectableItem]));
            state.templatesLoaded = true;
        },
    },
});

export const {
    setPayments,
    setFilterValue,
    setPaymentTypes,
    setModuleInitializedState,
    filterPayments,
    setSortColumn,
    setTypeSortColumn,
    filterPaymentTypes,
    toggleGroupView,
    setCurrentPage,
    setTemplates,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
