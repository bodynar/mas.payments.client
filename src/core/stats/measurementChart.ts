import { isNullOrUndefined, isStringEmpty } from "@bodynarf/utils";

import { ChartConfig, ChartData } from "@app/models/stats";
import { getDateIfDefined, get, getShortMonthName } from "@app/utils";

/**
 * Load measurements chart series data
 * @param config Chart configuration
 * @returns Promise with chart series data
 */
export const getChartData = ({ from, to, type }: ChartConfig): Promise<Array<ChartData>> => {
    const fromDate = getDateIfDefined(from ?? {});
    const toDate = getDateIfDefined(to ?? {});

    const queryParams = new URLSearchParams();

    if (!isNullOrUndefined(fromDate)) {
        queryParams.set("from", new Date(fromDate!.year, --fromDate!.month).toDateString());
    }
    if (!isNullOrUndefined(toDate)) {
        queryParams.set("to", new Date(toDate!.year, --toDate!.month).toDateString());
    }
    if (!isNullOrUndefined(type)) {
        queryParams.set("measurementTypeId", type!.value);
    }

    const queryString = queryParams.toString();

    const apiUri = isStringEmpty(queryString)
        ? "api/stats/getMeasurementStatistics"
        : `api/stats/getMeasurementStatistics?${queryString}`;

    return get<Array<any>>(apiUri)
        .then(({ typeStatistics }: any) => {
            const isSameYear = new Set(
                typeStatistics.map((x: any) => x['statisticsData'].map((y: any) => y['year'])).flat()
            ).size === 1;

            return typeStatistics.map((x: any) => ({
                key: x.measurementTypeName,
                data: new Map<string, number>(
                    x['statisticsData']
                        .trimNotDefinedValuesBy((y: any) => y['measurementDiff'])
                        .map(
                            (y: any) =>
                                [
                                    isSameYear
                                        ? getShortMonthName(y['month'])
                                        : getShortMonthName(y['month']) + ' ' + y['year'],
                                    y['measurementDiff']
                                ]
                        )
                )
            }) as ChartData);
        });
};
