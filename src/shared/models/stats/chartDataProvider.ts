import { ChartConfig, ChartData } from "./";

/**
 * Chart series data provider
 */
export type ChartDataProvider = (config: ChartConfig) => Promise<Array<ChartData>>;
