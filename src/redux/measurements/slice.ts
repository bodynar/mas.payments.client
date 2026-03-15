import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { isNullOrEmpty, isUndefined, isNullish, Group } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";

import { MeasurementType, Measurement, MeasurementFilter } from "@app/models/measurements";
import { SortColumn } from "@app/models";

import { sort } from "@app/utils";
import { filterEntities } from "@app/core";

import { MeasurementModuleState } from "./types";

const initialState: MeasurementModuleState = {
    initialized: false,
    useGroupedView: false,
    measurements: [],
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
            state.measurements = items;
            state.filteredItems = isNullish(state.lastFilter)
                ? items
                : filterEntities(items, state.lastFilter);
        },
        setFilterValue: {
            reducer(state, action: PayloadAction<{ filter?: MeasurementFilter; applyFilter: boolean }>) {
                const { filter, applyFilter } = action.payload;

                if (isUndefined(filter)) {
                    state.lastFilter = filter;
                    state.filteredItems = state.measurements;
                } else {
                    state.lastFilter = filter;
                    if (applyFilter) {
                        state.filteredItems = filterEntities(state.measurements, filter);
                    }
                }
            },
            prepare(filter?: MeasurementFilter, applyFilter: boolean = false) {
                return { payload: { filter, applyFilter } };
            },
        },
        setMeasurementTypes(state, action: PayloadAction<MeasurementType[]>) {
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
        filterMeasurements(state) {
            state.filteredItems = filterEntities(state.measurements, state.lastFilter);
        },
        setSortColumn(state, action: PayloadAction<SortColumn<Measurement>>) {
            state.measurementSortColumn = action.payload;
            state.filteredItems = sort(state.filteredItems, action.payload);
        },
        setTypeSortColumn(state, action: PayloadAction<SortColumn<MeasurementType>>) {
            const sortColumn = action.payload;
            state.measurementTypeSortColumn = sortColumn;
            const allTypes = sort([...state.typesMap.values()], sortColumn);
            state.filteredTypes = allTypes.filter(
                ({ caption }) => caption.toLocaleLowerCase().includes(state.typeFilterCaption?.toLocaleLowerCase() ?? "")
            );
        },
        filterMeasurementTypes(state, action: PayloadAction<string | undefined>) {
            const filterValue = action.payload;
            const allTypes = state.measurementTypeSortColumn
                ? sort([...state.typesMap.values()], state.measurementTypeSortColumn)
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
        setGroupedByType(state, action: PayloadAction<Array<Group<Measurement>> | undefined>) {
            state.groupedByType = action.payload;
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.lastPage = action.payload;
        },
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
