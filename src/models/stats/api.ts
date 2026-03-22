/** Single statistics data point from API */
export interface StatisticsDataPoint {
    month: number;
    year: number;
    amount?: number;
    measurementDiff?: number;
}

/** Statistics data for a single type from API */
export interface TypeStatistics {
    paymentTypeId?: string;
    paymentTypeName?: string;
    measurementTypeId?: string;
    measurementTypeName?: string;
    statisticsData: Array<StatisticsDataPoint>;
}

/** Statistics API response wrapper */
export interface StatisticsResponse {
    from: string | null;
    to: string | null;
    typeStatistics: Array<TypeStatistics>;
}
