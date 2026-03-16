import { groupMeasurementsByType } from "@app/core/measurement";

import { AppThunkAction, AppThunkDispatch } from "@app/redux/createAppAsyncThunk";
import { CompositeAppState } from "@app/redux";
import { setGroupedByType } from "@app/redux/measurements";

/**
 * Group all measurements by type
 * @returns Action function that can be called with redux dispatcher
 */
export const groupByType = (): AppThunkAction => (
    dispatch: AppThunkDispatch,
    getState: () => CompositeAppState
): void => {
    const { measurements: state } = getState();

    const groupedByType = groupMeasurementsByType(
        [...state.measurements]
            .sort((l, r) =>
                new Date(l.year, l.month - 1, 1).getTime()
                - new Date(r.year, r.month - 1, 1).getTime()
            )
    );

    dispatch(
        setGroupedByType(
            groupedByType.map(({ items, key }) => ({ key: +key!, items }))
        )
    );
};
