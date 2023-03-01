import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { get } from "@app/utils/delayedApi";

import { CompositeAppState } from "@app/redux/rootReducer";
import { ActionWithPayload } from "@app/redux/types";
import { getDisplayErrorMessageAction } from "@app/redux/utils";

import { getSetAppIsLoadingAction } from "@app/redux/app/actionCreators/setAppIsLoading";

import { getSetMeasurementsWithoutDiffAction } from "../actionCreators/setMeasurementsWithoutDiff";

/**
 * Get measurements without diff count
 * @returns Action function that can be called with redux dispatcher
 */
export const getMeasurementsWithoutDiff = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> =>
    (dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
        getState: () => CompositeAppState
    ): void => {
        dispatch(getSetAppIsLoadingAction(true));

        get<number>(`api/measurement/withoutDiff`)
            .then((count: number) => {
                dispatch(getSetMeasurementsWithoutDiffAction(count));

                dispatch(getSetAppIsLoadingAction(false));
            })
            .catch(getDisplayErrorMessageAction(dispatch, getState));
    };

