import { createChartDataProvider } from "./chartProvider";

/**
 * Load measurements chart series data
 * @param config Chart configuration
 * @returns Promise with chart series data
 */
export const getChartData = createChartDataProvider({
    apiUri: "api/stats/getMeasurementStatistics",
    typeIdParam: "measurementTypeId",
    typeNameKey: "measurementTypeName",
    valueKey: "measurementDiff",
});
