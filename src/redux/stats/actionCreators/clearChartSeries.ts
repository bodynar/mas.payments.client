import { Chart } from "@app/models/stats";

import { ActionWithPayload } from "@app/redux";
import { CLEAR_CHART_SERIES } from "@app/redux/stats";

/**
 * Build redux action for clearing chart series data
 * @param chartKey Unique chart key
 * @returns Redux-action
 */
export const getClearChartSeriesAction = (chartKey: Chart): ActionWithPayload => {
    return {
        type: CLEAR_CHART_SERIES,
        payload: {
            chartKey,
        }
    };
};
