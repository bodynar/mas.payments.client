import { MeasurementType } from "@app/models/measurements";
import { SortColumn } from "@app/models";

import { ActionWithPayload } from "@app/redux";
import { SET_TYPE_SORT_COLUMN } from "@app/redux/measurements";

/**
 * Get redux action "Set measurement type sort column"
 * @param sortColumn Sort column
 * @returns Redux action to update state
 */
export const getSetTypeSortColumnAction = (sortColumn: SortColumn<MeasurementType>): ActionWithPayload => ({
    type: SET_TYPE_SORT_COLUMN,
    payload: { sortColumn },
});
