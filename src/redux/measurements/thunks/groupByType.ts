import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { groupMeasurementsByType } from "@app/core/measurement";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { getSetGroupedByTypeAction } from "@app/redux/measurements";

/**
 * Group all measurements by type
 * @returns Action function that can be called with redux dispatcher
 */
export const groupByType = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    const { measurements: state } = getState();

    const groupedByType = groupMeasurementsByType(
        state.measurements
            .sort((l, r) =>
                new Date(l.year, l.month - 1, 1).getTime()
                - new Date(r.year, r.month - 1, 1).getTime()
            )
    );

    dispatch(
        getSetGroupedByTypeAction(
            groupedByType.map(({ items, key }) => ({ key: +key!, items }))
        )
    );
};
