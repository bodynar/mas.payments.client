import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { isNullish, Group } from "@bodynarf/utils";

import { MeasurementType, Measurement, MeasurementFilter } from "@app/models/measurements";
import { SortColumn } from "@app/models";

import { filterEntities } from "@app/core";

import { MeasurementModuleState } from "./types";
import {
    setModuleInitializedStateReducer, toggleGroupViewReducer, setCurrentPageReducer,
    createSetFilterValueReducer, setTypesReducer, filterItemsReducer,
    setSortColumnReducer, setTypeSortColumnReducer, filterTypesReducer,
} from "../sliceUtils";

const initialState: MeasurementModuleState = {
    initialized: false,
    useGroupedView: false,
    records: [],
    filteredItems: [],
    typesMap: new Map(),
    availableTypesAsDropdownItems: [],
    filteredTypes: [],
};

const measurementsSlice = createSlice({
    name: "mas.payments/measurement",
    initialState,
    reducers: {
        setMeasurements(state, action: PayloadAction<Measurement[]>) {
            const items = action.payload;
            state.records = items;
            state.filteredItems = isNullish(state.lastFilter)
                ? items
                : filterEntities(items, state.lastFilter);
        },
        setFilterValue: createSetFilterValueReducer<Measurement, MeasurementFilter>(),
        setMeasurementTypes(state, action: PayloadAction<MeasurementType[]>) {
            setTypesReducer(state, action);
        },
        setModuleInitializedState: setModuleInitializedStateReducer,
        filterMeasurements(state) {
            filterItemsReducer(state);
        },
        setSortColumn(state, action: PayloadAction<SortColumn<Measurement>>) {
            setSortColumnReducer(state, action);
        },
        setTypeSortColumn(state, action: PayloadAction<SortColumn<MeasurementType>>) {
            setTypeSortColumnReducer(state, action);
        },
        filterMeasurementTypes(state, action: PayloadAction<string | undefined>) {
            filterTypesReducer(state, action);
        },
        toggleGroupView: toggleGroupViewReducer,
        setGroupedByType(state, action: PayloadAction<Array<Group<Measurement>> | undefined>) {
            state.groupedByType = action.payload;
        },
        setCurrentPage: setCurrentPageReducer,
    },
});

export const {
    setMeasurements,
    setFilterValue,
    setMeasurementTypes,
    setModuleInitializedState,
    filterMeasurements,
    setSortColumn,
    setTypeSortColumn,
    filterMeasurementTypes,
    toggleGroupView,
    setGroupedByType,
    setCurrentPage,
} = measurementsSlice.actions;

export default measurementsSlice.reducer;

