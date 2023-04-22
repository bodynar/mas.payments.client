import { getPropertyValueWithCheck } from "@bodynarf/utils";

import { Chart, ChartConfig, ChartData } from "@app/models/stats";

import { ActionWithPayload } from "@app/redux";

import { StatisticsModuleState } from "./types";
import { SAVE_CHART_CONFIG, SAVE_CHART_SERIES } from "./actions";

/** Initial module state */
const defaultState: StatisticsModuleState = {
    charts: new Map(),
};

/**
 * Update module state depending on dispatched action
 * @param state Current state
 * @param action Dispatched action
 * @returns Updated state
 */
export default function (state: StatisticsModuleState = defaultState, action: ActionWithPayload): StatisticsModuleState {
    switch (action.type) {
        case SAVE_CHART_CONFIG: {
            const chartConfig = getPropertyValueWithCheck<ChartConfig>(action.payload, "chartConfig", true);

            if (state.charts.has(chartConfig.chart)) {
                const chartData = state.charts.get(chartConfig.chart)!;

                chartData.lastConfig = chartConfig;
                chartData.lastData = undefined;
            } else {
                state.charts.set(chartConfig.chart, {
                    key: chartConfig.chart,
                    lastConfig: chartConfig,
                });
            }

            return state;
        }
        case SAVE_CHART_SERIES: {
            const chartKey = getPropertyValueWithCheck<Chart>(action.payload, "chartKey", true);

            const chartSeries = getPropertyValueWithCheck<Array<ChartData>>(action.payload, "chartData", true);

            if (state.charts.has(chartKey)) {
                const chartData = state.charts.get(chartKey)!;

                chartData.lastData = chartSeries;
            } else {
                throw new Error(`Chart "${chartKey}" is processed, but it wasn't initialized.`);
            }

            return state;
        }
        default: {
            return state;
        }
    }
}
