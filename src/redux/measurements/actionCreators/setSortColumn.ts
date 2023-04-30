import { Measurement } from "@app/models/measurements";
import { SortColumn } from "@app/models";

import { ActionWithPayload } from "@app/redux";
import { SET_MEASUREMENT_SORT_COLUMN } from "@app/redux/measurements";

/**
 * Get redux action "Set measurement sort column"
 * @param sortColumn Sort column
 * @returns Redux action to update state
 */
export const getSetSortColumnAction = (sortColumn: SortColumn<Measurement>): ActionWithPayload => ({
    type: SET_MEASUREMENT_SORT_COLUMN,
    payload: { sortColumn },
});
