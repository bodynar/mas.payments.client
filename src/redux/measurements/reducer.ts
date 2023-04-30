import { isUndefined, getPropertyValueWithCheck, isNullOrUndefined, getPropertyValue, isNullOrEmpty } from "@bodynarf/utils";

import { SelectableItem } from "@bodynarf/react.components";

import { MeasurementType, Measurement, MeasurementFilter, MeasurementGroupedByType } from "@app/models/measurements";
import { SortColumn } from "@app/models";

import { sort } from "@app/utils";

import { filterMeasurementList } from "@app/core/measurement";

import { ActionWithPayload } from "@app/redux";
import { FILTER_MEASUREMENTS, FILTER_MEASUREMENT_TYPES, MeasurementModuleState, SET_GROUPED_BY_TYPE, SET_MEASUREMENTS, SET_MEASUREMENT_FILTER_VALUE, SET_MEASUREMENT_SORT_COLUMN, SET_MEASUREMENT_TYPES, SET_MODULE_INITIALIZED_STATE, SET_TYPE_SORT_COLUMN, TOGGLE_GROUP_VIEW } from ".";

/** Initial module state */
const defaultState: MeasurementModuleState = {
    initialized: false,
    useGroupedView: false,
    measurements: [],
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
export default function (state: MeasurementModuleState = defaultState, action: ActionWithPayload): MeasurementModuleState {
    switch (action.type) {
        case SET_MEASUREMENTS: {
            const items = getPropertyValueWithCheck<Array<Measurement>>(action.payload, "measurements", true);

            const filteredItems = isNullOrUndefined(state.lastFilter) ? items : filterMeasurementList(items, state.lastFilter);

            return {
                ...state,
                measurements: items,
                filteredItems: filteredItems,
            };
        }
        case SET_MEASUREMENT_FILTER_VALUE: {
            const filterValue = getPropertyValueWithCheck<MeasurementFilter>(action.payload, "filter", false);
            const applyFilter = getPropertyValueWithCheck<boolean>(action.payload, "applyFilter", false);

            return isUndefined(filterValue)
                ? {
                    ...state,
                    lastFilter: filterValue,
                    filteredItems: state.measurements
                }
                : {
                    ...state,
                    lastFilter: filterValue,
                    filteredItems: !applyFilter ? state.filteredItems : filterMeasurementList(state.measurements, filterValue)
                };
        }
        case SET_MEASUREMENT_TYPES: {
            const types = getPropertyValueWithCheck<Array<MeasurementType>>(action.payload, "types", true);

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
        case FILTER_MEASUREMENTS: {
            const displayedItems = filterMeasurementList(state.measurements, state.lastFilter);

            return {
                ...state,
                filteredItems: displayedItems,
            };
        }
        case SET_MEASUREMENT_SORT_COLUMN: {
            const sortColumn = getPropertyValueWithCheck<SortColumn<Measurement>>(action.payload, "sortColumn", true);

            const sortedItems = sort(state.filteredItems, sortColumn);

            return {
                ...state,
                measurementSortColumn: sortColumn,
                filteredItems: sortedItems,
            };
        }
        case SET_TYPE_SORT_COLUMN: {
            const sortColumn = getPropertyValueWithCheck<SortColumn<MeasurementType>>(action.payload, "sortColumn", true);

            const sortedItems = sort(state.availableTypes, sortColumn);

            return {
                ...state,
                measurementTypeSortColumn: sortColumn,
                availableTypes: sortedItems,
                filteredTypes: state.availableTypes.filter(({ caption }) => caption.toLocaleLowerCase().includes(state.typeFilterCaption?.toLocaleLowerCase() ?? "")),
            };
        }
        case FILTER_MEASUREMENT_TYPES: {
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
        case SET_GROUPED_BY_TYPE: {
            const groups = getPropertyValue<Array<MeasurementGroupedByType>>(action.payload, "groups");

            return {
                ...state,
                groupedByType: groups,
            };
        }
        default: {
            return state;
        }
    }
}
