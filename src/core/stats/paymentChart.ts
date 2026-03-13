import { createChartDataProvider } from "./chartProvider";

/**
 * Load payments chart series data
 * @param config Chart configuration
 * @returns Promise with chart series data
 */
export const getChartData = createChartDataProvider({
    apiUri: "api/stats/getPaymentsStatistics",
    typeIdParam: "paymentTypeId",
    typeNameKey: "paymentTypeName",
    valueKey: "amount",
});
