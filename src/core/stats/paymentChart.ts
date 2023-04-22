import { isNullOrUndefined, isStringEmpty } from "@bodynarf/utils";

import { ChartConfig, ChartData } from "@app/models/stats";
import { getMonthName } from "@app/constants";
import { getDateIfDefined, get } from "@app/utils";

/**
 * Load chart series data
 * @param config Chart configuration
 * @returns Promise with chart series data
 */
export const getChartData = ({ from, to, type }: ChartConfig): Promise<Array<ChartData>> => {
    const fromDate = getDateIfDefined(from);
    const toDate = getDateIfDefined(to);

    const queryParams = new URLSearchParams();

    if (!isNullOrUndefined(fromDate)) {
        queryParams.set("from", new Date(fromDate!.year, fromDate!.month).toDateString());
    }
    if (!isNullOrUndefined(toDate)) {
        queryParams.set("to", new Date(toDate!.year, toDate!.month).toDateString());
    }
    if (!isNullOrUndefined(type)) {
        queryParams.set("paymentTypeId", type!.value);
    }

    const queryString = queryParams.toString();

    const apiUri = isStringEmpty(queryString)
        ? "api/stats/getPaymentsStatistics"
        : `api/stats/getPaymentsStatistics?${queryString}`;

    return get<Array<any>>(apiUri)
        .then(({ typeStatistics }: any) => {
            const isSameYear = new Set(
                typeStatistics.map((x: any) => x['statisticsData'].map((y: any) => y['year'])).flat()
            ).size === 1;

            return typeStatistics.map((x: any) => ({
                key: x.paymentTypeId,
                data: new Map<string, number>(
                    x['statisticsData'].map(
                        (y: any) =>
                            [
                                isSameYear
                                    ? getMonthName(y['month'])
                                    : getMonthName(y['month']) + ' ' + y['year'],
                                y['amount']
                            ]
                    )
                )
            }) as ChartData);
        });
};
