import { isNotNullish, isStringEmpty } from "@bodynarf/utils";

import { ChartConfig, ChartData, StatisticsResponse, TypeStatistics, StatisticsDataPoint } from "@app/models/stats";
import { getDateIfDefined, get, getShortMonthName } from "@app/utils";

/**
 * Load payments chart series data
 * @param config Chart configuration
 * @returns Promise with chart series data
 */
export const getChartData = ({ from, to, type }: ChartConfig): Promise<Array<ChartData>> => {
    const fromDate = getDateIfDefined(from ?? {});
    const toDate = getDateIfDefined(to ?? {});

    const queryParams = new URLSearchParams();

    if (isNotNullish(fromDate)) {
        queryParams.set("from", new Date(fromDate!.year, fromDate!.month - 1).toDateString());
    }
    if (isNotNullish(toDate)) {
        queryParams.set("to", new Date(toDate!.year, toDate!.month - 1).toDateString());
    }
    if (isNotNullish(type)) {
        queryParams.set("paymentTypeId", type!.value);
    }

    const queryString = queryParams.toString();

    const apiUri = isStringEmpty(queryString)
        ? "api/stats/getPaymentsStatistics"
        : `api/stats/getPaymentsStatistics?${queryString}`;

    return get<StatisticsResponse>(apiUri)
        .then(({ typeStatistics }) => {
            const isSameYear = new Set(
                typeStatistics.map((x: TypeStatistics) => x.statisticsData.map((y: StatisticsDataPoint) => y.year)).flat()
            ).size === 1;

            return typeStatistics.map((x: TypeStatistics) => ({
                key: x.paymentTypeName ?? "",
                data: new Map<string, number>(
                    (x.statisticsData as Array<StatisticsDataPoint & { trimNotDefinedValuesBy: (fn: (y: StatisticsDataPoint) => number | undefined) => Array<StatisticsDataPoint> }>)
                        .trimNotDefinedValuesBy((y: StatisticsDataPoint) => y.amount)
                        .map(
                            (y: StatisticsDataPoint) =>
                                [
                                    isSameYear
                                        ? getShortMonthName(y.month)
                                        : getShortMonthName(y.month) + ' ' + y.year,
                                    y.amount ?? 0
                                ]
                        )
                )
            }) as ChartData);
        });
};
