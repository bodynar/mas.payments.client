import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ChartConfig } from "@app/models/stats";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { clearChartSeries, saveChartConfig, saveChartSeries } from "@app/redux/stats";
import { getNotifications } from "@app/redux/notificator";

import { getChartDataProvider } from "@app/core/stats";

/**
 * Build redux thunk that could be called with dispatch
 * @param config Chart configuration
 */
export const loadChartData = (config: ChartConfig): ThunkAction<Promise<void>, CompositeAppState, void, ActionWithPayload> => async (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): Promise<void> => {
    dispatch(setAppIsLoading(true));
    dispatch(saveChartConfig(config));
    dispatch(clearChartSeries(config.chart));

    const dataProvider = getChartDataProvider(config.chart);

    const [_, displayError] = getNotifications(dispatch, getState);

    return dataProvider(config)
        .then(chartSeries => {
            dispatch(saveChartSeries({ chartKey: config.chart, chartData: chartSeries }));

            dispatch(setAppIsLoading(false));
        })
        .catch(displayError);
};
