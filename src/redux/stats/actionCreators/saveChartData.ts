import { ChartConfig } from "@app/models/stats";

import { ActionWithPayload } from "@app/redux";
import { SAVE_CHART_CONFIG } from "@app/redux/stats";

/**
 * Build redux action for saving chart config data
 * @param chartConfig Chart configuration data
 * @returns Redux-action
 */
export const getSaveChartConfigAction = (chartConfig: ChartConfig): ActionWithPayload => {
    return {
        type: SAVE_CHART_CONFIG,
        payload: { chartConfig }
    };
};
