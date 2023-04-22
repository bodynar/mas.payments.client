import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ChartConfig } from "@app/models/stats";

import { ActionWithPayload, CompositeAppState, getDisplayErrorMessageAction } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getSaveChartConfigAction, getSaveChartSeriesAction } from "@app/redux/stats";

import { getChartDataProvider } from "@app/core/stats";

/**
 * Build redux thunk that could be called with dispatch
 * @param config Chart configuration
 */
export const loadChartData = (config: ChartConfig): ThunkAction<Promise<void>, CompositeAppState, void, ActionWithPayload> => async (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(getSetAppIsLoadingAction(true));
    dispatch(getSaveChartConfigAction(config));

    const dataProvider = getChartDataProvider(config.chart);

    dataProvider(config)
        .then(chartSeries => {
            dispatch(getSaveChartSeriesAction(config.chart, chartSeries));

            dispatch(getSetAppIsLoadingAction(false));
        })
        .catch(getDisplayErrorMessageAction(dispatch, getState));
};
