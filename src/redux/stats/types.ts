import { Chart, ChartConfig, ChartData } from "@app/models/stats";

/** Stats module chart data */
export interface ModuleChart {
    /** Unique chart key */
    key: Chart;

    /** Chart last configuration */
    lastConfig: ChartConfig;

    /** Chart last loaded series */
    lastData?: Array<ChartData>;
}

/** Stats module state */
export interface StatisticsModuleState {
    /** Charts data */
    charts: Map<Chart, ModuleChart>;
}
