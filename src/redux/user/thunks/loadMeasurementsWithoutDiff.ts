import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { get } from "@app/utils";

import { CompositeAppState, ActionWithPayload } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { setMeasurementsWithoutDiff } from "@app/redux/user";
import { getNotifications } from "@app/redux/notificator";

/**
 * Get measurements without diff count
 * @returns Action function that can be called with redux dispatcher
 */
export const getMeasurementsWithoutDiff = (): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> =>
    (dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
        getState: () => CompositeAppState
    ): void => {
        dispatch(setAppIsLoading(true));

        const [_, displayError] = getNotifications(dispatch, getState);

        get<number>(`api/measurement/withoutDiff`)
            .then((count: number) => {
                dispatch(setMeasurementsWithoutDiff(count));

                dispatch(setAppIsLoading(false));
            })
            .catch(displayError);
    };

