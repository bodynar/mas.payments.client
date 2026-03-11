/** Single statistics data point from API */
export interface StatisticsDataPoint {
    month: number;
    year: number;
    amount?: number;
    measurementDiff?: number;
}

/** Statistics data for a single type from API */
export interface TypeStatistics {
    paymentTypeName?: string;
    measurementTypeName?: string;
    statisticsData: Array<StatisticsDataPoint>;
}

/** Statistics API response wrapper */
export interface StatisticsResponse {
    typeStatistics: Array<TypeStatistics>;
}
