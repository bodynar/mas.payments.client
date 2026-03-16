import { ChartConfig } from "@app/models/stats";

import { createAppAsyncThunk } from "@app/redux";
import { clearChartSeries, saveChartConfig, saveChartSeries } from "@app/redux/stats";

import { getChartDataProvider } from "@app/core/stats";

/**
 * Load and display chart data by configuration
 */
export const loadChartData = createAppAsyncThunk(
    async ({ dispatch }, config: ChartConfig) => {
        dispatch(saveChartConfig(config));
        dispatch(clearChartSeries(config.chart));

        const dataProvider = getChartDataProvider(config.chart);
        const chartSeries = await dataProvider(config);

        dispatch(saveChartSeries({ chartKey: config.chart, chartData: chartSeries }));
    }
);
