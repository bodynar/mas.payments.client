import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { isNullOrEmpty, isUndefined, isNullish, Group } from "@bodynarf/utils";
import { SelectableItem } from "@bodynarf/react.components";

import { MeasurementType, Measurement, MeasurementFilter } from "@app/models/measurements";
import { SortColumn } from "@app/models";

import { sort } from "@app/utils";
import { filterMeasurementList } from "@app/core/measurement";

import { MeasurementModuleState } from "./types";

const initialState: MeasurementModuleState = {
    initialized: false,
    useGroupedView: false,
    measurements: [],
    filteredItems: [],
    availableTypes: [],
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
                : filterMeasurementList(items, state.lastFilter);
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
                        state.filteredItems = filterMeasurementList(state.measurements, filter);
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

            state.availableTypes = types;
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
            state.filteredItems = filterMeasurementList(state.measurements, state.lastFilter);
        },
        setSortColumn(state, action: PayloadAction<SortColumn<Measurement>>) {
            state.measurementSortColumn = action.payload;
            state.filteredItems = sort(state.filteredItems, action.payload);
        },
        setTypeSortColumn(state, action: PayloadAction<SortColumn<MeasurementType>>) {
            const sortColumn = action.payload;
            state.measurementTypeSortColumn = sortColumn;
            state.availableTypes = sort(state.availableTypes, sortColumn);
            state.filteredTypes = state.availableTypes.filter(
                ({ caption }) => caption.toLocaleLowerCase().includes(state.typeFilterCaption?.toLocaleLowerCase() ?? "")
            );
        },
        filterMeasurementTypes(state, action: PayloadAction<string | undefined>) {
            const filterValue = action.payload;

            if (isNullOrEmpty(filterValue)) {
                state.filteredTypes = state.availableTypes;
                return;
            }

            const lowered = filterValue!.toLocaleLowerCase();
            state.filteredTypes = state.availableTypes.filter(
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
