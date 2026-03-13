import { isNotNullish, isStringEmpty } from "@bodynarf/utils";

import { ChartConfig, ChartData, StatisticsResponse, TypeStatistics, StatisticsDataPoint } from "@app/models/stats";
import { getDateIfDefined, get, getShortMonthName } from "@app/utils";

interface ChartProviderConfig {
    /** API endpoint path */
    apiUri: string;

    /** Query param name for the type filter */
    typeIdParam: string;

    /** Key in TypeStatistics for the series name */
    typeNameKey: keyof TypeStatistics;

    /** Key in StatisticsDataPoint for the value */
    valueKey: keyof StatisticsDataPoint;
}

/**
 * Create a chart data provider for a specific chart type
 * @param providerConfig Configuration for the chart provider
 * @returns Function that loads chart series data
 */
export const createChartDataProvider = (providerConfig: ChartProviderConfig) =>
    ({ from, to, type }: ChartConfig): Promise<Array<ChartData>> => {
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
            queryParams.set(providerConfig.typeIdParam, type!.value);
        }

        const queryString = queryParams.toString();

        const apiUri = isStringEmpty(queryString)
            ? providerConfig.apiUri
            : `${providerConfig.apiUri}?${queryString}`;

        return get<StatisticsResponse>(apiUri)
            .then(({ typeStatistics }) => {
                const isSameYear = new Set(
                    typeStatistics.map((x: TypeStatistics) => x.statisticsData.map((y: StatisticsDataPoint) => y.year)).flat()
                ).size === 1;

                return typeStatistics.map((x: TypeStatistics) => ({
                    key: (x[providerConfig.typeNameKey] as string) ?? "",
                    data: new Map<string, number>(
                        (x.statisticsData as Array<StatisticsDataPoint & { trimNotDefinedValuesBy: (fn: (y: StatisticsDataPoint) => number | undefined) => Array<StatisticsDataPoint> }>)
                            .trimNotDefinedValuesBy((y: StatisticsDataPoint) => y[providerConfig.valueKey] as number | undefined)
                            .map(
                                (y: StatisticsDataPoint) =>
                                    [
                                        isSameYear
                                            ? getShortMonthName(y.month)
                                            : getShortMonthName(y.month) + ' ' + y.year,
                                        (y[providerConfig.valueKey] as number) ?? 0
                                    ]
                            )
                    )
                }) as ChartData);
            });
    };
