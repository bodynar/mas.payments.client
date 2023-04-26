import * as pmt from "./paymentChart";
import * as mrm from "./measurementChart";

import { Chart, ChartDataProvider } from "@app/models/stats";

/** Registered chart series data providers */
const chartProviders = new Map<Chart, ChartDataProvider>([
    [Chart.Payments, pmt.getChartData],
    [Chart.Measurements, mrm.getChartData]
]);

/**
 * Get chart series data provider
 * @param chart Chart unique key
 * @returns Chart series data provider function if found
 * @throws If chart is not having any series data provider
 */
export const getChartDataProvider = (chart: Chart): ChartDataProvider => {
    if (chartProviders.has(chart)) {
        return chartProviders.get(chart)!;
    }

    throw new Error(`Chart data provider for chart "${chart}" is not registered.`);
};
