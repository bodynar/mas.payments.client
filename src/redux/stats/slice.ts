import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Chart, ChartConfig, ChartData } from "@app/models/stats";

import { ModuleChart, StatisticsModuleState } from "./types";

const initialState: StatisticsModuleState = {
    charts: new Map(),
};

const statsSlice = createSlice({
    name: "mas.payments/stats",
    initialState,
    reducers: {
        saveChartConfig(state, action: PayloadAction<ChartConfig>) {
            const chartConfig = action.payload;
            const existing = state.charts.get(chartConfig.chart);

            if (existing) {
                state.charts.set(chartConfig.chart, {
                    ...existing,
                    lastConfig: { ...existing.lastConfig, ...chartConfig },
                });
            } else {
                state.charts.set(chartConfig.chart, {
                    key: chartConfig.chart,
                    lastConfig: chartConfig,
                });
            }
        },
        saveChartSeries(state, action: PayloadAction<{ chartKey: Chart; chartData: ChartData[] }>) {
            const { chartKey, chartData } = action.payload;
            const existing = state.charts.get(chartKey);

            if (!existing) {
                throw new Error(`Chart "${chartKey}" is processed, but it wasn't initialized.`);
            }

            state.charts.set(chartKey, { ...existing, lastData: chartData });
        },
        clearChartSeries(state, action: PayloadAction<Chart>) {
            const existing = state.charts.get(action.payload);

            if (existing) {
                state.charts.set(action.payload, { ...existing, lastData: undefined });
            }
        },
        saveConfigPanelVisibility(state, action: PayloadAction<{ chartKey: Chart; collapsed: boolean }>) {
            const { chartKey, collapsed } = action.payload;
            const existing = state.charts.get(chartKey);

            if (existing) {
                state.charts.set(chartKey, {
                    ...existing,
                    lastConfig: { ...existing.lastConfig, configIsCollapsed: collapsed },
                });
            } else {
                state.charts.set(chartKey, {
                    key: chartKey,
                    lastConfig: { chart: chartKey, configIsCollapsed: collapsed },
                } as ModuleChart);
            }
        },
    },
});

export const {
    saveChartConfig,
    saveChartSeries,
    clearChartSeries,
    saveConfigPanelVisibility,
} = statsSlice.actions;

export default statsSlice.reducer;
