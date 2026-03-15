import { createSelector } from "@reduxjs/toolkit";

import { CompositeAppState } from "@app/redux";
import { sort } from "@app/utils";
import { filterMeasurementList } from "@app/core/measurement";

const selectMeasurementsState = (state: CompositeAppState) => state.measurements;

/** Select measurements filtered by current filter */
export const selectFilteredMeasurements = createSelector(
    [selectMeasurementsState],
    ({ measurements, lastFilter }) => filterMeasurementList(measurements, lastFilter)
);

/** Select measurements filtered and sorted by current config */
export const selectSortedFilteredMeasurements = createSelector(
    [selectFilteredMeasurements, (state: CompositeAppState) => state.measurements.measurementSortColumn],
    (filtered, sortColumn) => sortColumn ? sort(filtered, sortColumn) : filtered
);

/** Select measurement types filtered by caption and sorted */
export const selectFilteredMeasurementTypes = createSelector(
    [selectMeasurementsState],
    ({ typesMap, measurementTypeSortColumn, typeFilterCaption }) => {
        let types = [...typesMap.values()];

        if (measurementTypeSortColumn) {
            types = sort(types, measurementTypeSortColumn);
        }

        if (typeFilterCaption) {
            const lowered = typeFilterCaption.toLocaleLowerCase();
            types = types.filter(
                ({ caption }) => caption.toLocaleLowerCase().includes(lowered)
            );
        }

        return types;
    }
);
