import { getPropertyValueWithCheck } from "@bodynarf/utils";

import { Chart, ChartConfig, ChartData } from "@app/models/stats";

import { ActionWithPayload } from "@app/redux";

import { StatisticsModuleState } from "./types";
import { CLEAR_CHART_SERIES, SAVE_CHART_CONFIG, SAVE_CHART_SERIES, SAVE_CONFIG_PANEL_VISIBILITY } from "./actions";

/** Initial module state */
const defaultState: StatisticsModuleState = {
    charts: new Map(),
};

/**
 * Create a new Map with an updated entry, preserving immutability
 * @param charts Current charts map
 * @param key Chart key to update
 * @param updater Function that returns updated chart data
 * @returns New Map instance
 */
const updateChart = (
    charts: Map<Chart, import("./types").ModuleChart>,
    key: Chart,
    updater: (existing: import("./types").ModuleChart) => import("./types").ModuleChart,
): Map<Chart, import("./types").ModuleChart> => {
    const newCharts = new Map(charts);
    const existing = newCharts.get(key);

    if (existing) {
        newCharts.set(key, updater(existing));
    }

    return newCharts;
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
            const newCharts = new Map(state.charts);

            if (newCharts.has(chartConfig.chart)) {
                const existing = newCharts.get(chartConfig.chart)!;
                newCharts.set(chartConfig.chart, {
                    ...existing,
                    lastConfig: {
                        ...existing.lastConfig,
                        ...chartConfig
                    },
                });
            } else {
                newCharts.set(chartConfig.chart, {
                    key: chartConfig.chart,
                    lastConfig: chartConfig,
                });
            }

            return { ...state, charts: newCharts };
        }
        case SAVE_CHART_SERIES: {
            const chartKey = getPropertyValueWithCheck<Chart>(action.payload, "chartKey", true);
            const chartSeries = getPropertyValueWithCheck<Array<ChartData>>(action.payload, "chartData", true);

            if (!state.charts.has(chartKey)) {
                throw new Error(`Chart "${chartKey}" is processed, but it wasn't initialized.`);
            }

            return {
                ...state,
                charts: updateChart(state.charts, chartKey, (existing) => ({
                    ...existing,
                    lastData: chartSeries,
                })),
            };
        }
        case CLEAR_CHART_SERIES: {
            const chartKey = getPropertyValueWithCheck<Chart>(action.payload, "chartKey", true);

            if (!state.charts.has(chartKey)) {
                return state;
            }

            return {
                ...state,
                charts: updateChart(state.charts, chartKey, (existing) => ({
                    ...existing,
                    lastData: undefined,
                })),
            };
        }
        case SAVE_CONFIG_PANEL_VISIBILITY: {
            const chartKey = getPropertyValueWithCheck<Chart>(action.payload, "chartKey", true);
            const collapsed = getPropertyValueWithCheck<boolean>(action.payload, "collapsed", true);
            const newCharts = new Map(state.charts);

            if (newCharts.has(chartKey)) {
                const existing = newCharts.get(chartKey)!;
                newCharts.set(chartKey, {
                    ...existing,
                    lastConfig: {
                        ...existing.lastConfig,
                        configIsCollapsed: collapsed,
                    },
                });
            } else {
                newCharts.set(chartKey, {
                    key: chartKey,
                    lastConfig: {
                        chart: chartKey,
                        configIsCollapsed: collapsed,
                    },
                });
            }

            return { ...state, charts: newCharts };
        }
        default: {
            return state;
        }
    }
}
