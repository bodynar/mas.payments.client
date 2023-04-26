import { Chart, ChartData } from "@app/models/stats";

import { ActionWithPayload } from "@app/redux";
import { SAVE_CHART_SERIES } from "@app/redux/stats";

/**
 * Build redux action for saving chart series data
 * @param chartKey Unique chart key
 * @param chartData Chart series data
 * @returns Redux-action
 */
export const getSaveChartSeriesAction = (chartKey: Chart, chartData: Array<ChartData>): ActionWithPayload => {
    return {
        type: SAVE_CHART_SERIES,
        payload: {
            chartKey,
            chartData,
        }
    };
};
