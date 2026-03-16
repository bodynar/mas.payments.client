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
    async ({ from, to, type }: ChartConfig): Promise<Array<ChartData>> => {
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

        const { typeStatistics } = await get<StatisticsResponse>(apiUri);

        const isSameYear = new Set(
            typeStatistics.flatMap((x) => x.statisticsData.map((y) => y.year))
        ).size === 1;

        return typeStatistics.map((x): ChartData => {
            const trimmed = x.statisticsData.filter((y) => isNotNullish(y[providerConfig.valueKey]));

            return {
                key: (x[providerConfig.typeNameKey] as string) ?? "",
                data: new Map(
                    trimmed.map((y) => [
                        isSameYear
                            ? getShortMonthName(y.month)
                            : getShortMonthName(y.month) + " " + y.year,
                        (y[providerConfig.valueKey] as number) ?? 0,
                    ])
                ),
            };
        });
    };
