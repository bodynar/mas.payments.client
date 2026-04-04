import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { isNullish } from "@bodynarf/utils";

import { PaymentType, Payment, PaymentFilter, PaymentGroupTemplate } from "@app/models/payments";
import { SortColumn } from "@app/models";

import { filterEntities } from "@app/core";

import { PaymentModuleState } from "./types";
import {
    setModuleInitializedStateReducer, toggleGroupViewReducer, setCurrentPageReducer,
    createSetFilterValueReducer, setTypesReducer, filterItemsReducer,
    setSortColumnReducer, setTypeSortColumnReducer, filterTypesReducer,
} from "../sliceUtils";

const initialState: PaymentModuleState = {
    initialized: false,
    useGroupedView: false,
    records: [],
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
            state.records = payments;
            state.filteredItems = isNullish(state.lastFilter)
                ? payments
                : filterEntities(payments, state.lastFilter);
        },
        setFilterValue: createSetFilterValueReducer<Payment, PaymentFilter>(),
        setPaymentTypes(state, action: PayloadAction<PaymentType[]>) {
            setTypesReducer(state, action);
        },
        setModuleInitializedState: setModuleInitializedStateReducer,
        filterPayments(state) {
            filterItemsReducer(state);
        },
        setSortColumn(state, action: PayloadAction<SortColumn<Payment>>) {
            setSortColumnReducer(state, action);
        },
        setTypeSortColumn(state, action: PayloadAction<SortColumn<PaymentType>>) {
            setTypeSortColumnReducer(state, action);
        },
        filterPaymentTypes(state, action: PayloadAction<string | undefined>) {
            filterTypesReducer(state, action);
        },
        toggleGroupView: toggleGroupViewReducer,
        setCurrentPage: setCurrentPageReducer,
        setTemplates(state, action: PayloadAction<PaymentGroupTemplate[]>) {
            state.templatesMap = new Map(action.payload.map(t => [t.id, t]));
            state.templatesAsDropdownItems = new Map(action.payload.map(t => [t.id, {
                id: t.id,
                displayValue: t.name,
                value: t.id,
            }]));
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

