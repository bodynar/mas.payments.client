import { useCallback, useEffect, useState } from "react";

import { connect } from "react-redux";

import { SelectableItem } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Dropdown from "@bodynarf/react.components/components/dropdown";

import { LookupDate } from "@app/models";
import { Chart, ChartConfig, ChartData } from "@app/models/stats";

import { CompositeAppState } from "@app/redux";
import { loadTypes } from "@app/redux/payments";
import { getSaveChartConfigAction, loadChartData } from "@app/redux/stats";

import ChartDateOptions from "../chartDateOptions";

/** Payments chart component props type */
interface PaymentsChartProps {
    /** Payment types mapped to dropdown items to cache values */
    availableTypesAsDropdownItems: Array<SelectableItem>;

    /** Last loaded chart data */
    chartSeriesData: Array<ChartData>;

    /** Last chart configuration */
    lastConfig?: ChartConfig;

    /** Load all payment types */
    loadTypes: () => void;

    /** Save current chart configuration */
    saveConfig: (config: ChartConfig) => void;

    /** Load chart series data by specified config */
    loadChartData: (config: ChartConfig) => Promise<void>;
}

/** Payments chart component */
const PaymentsChart = ({
    availableTypesAsDropdownItems,
    loadTypes, loadChartData, saveConfig,
    chartSeriesData, lastConfig,
}: PaymentsChartProps): JSX.Element => {
    useEffect(() => {
        if (availableTypesAsDropdownItems.length === 0) {
            loadTypes();
        }
    }, [loadTypes, availableTypesAsDropdownItems]);

    const [fromDate, setFromDate] = useState<LookupDate>(lastConfig?.from ?? {});
    const [toDate, setToDate] = useState<LookupDate>(lastConfig?.to ?? {});
    const [type, setType] = useState<SelectableItem | undefined>(lastConfig?.type);

    const onShowDataClick = useCallback(
        () =>
            loadChartData({
                chart: Chart.Payments,
                from: fromDate,
                to: toDate,
                type: type,
            }),
        [fromDate, loadChartData, toDate, type]
    );

    useEffect(
        () => {
            saveConfig({
                chart: Chart.Payments,
                from: fromDate,
                to: toDate,
                type: type,
            });
        },
        [fromDate, saveConfig, toDate, type]
    );

    if (availableTypesAsDropdownItems.length === 0) {
        return <></>;
    }

    return (
        <>
            <nav>
                <div className="notification is-warning is-light">
                    To apply date as filter you should select <b>month and year</b>
                </div>
                <ChartDateOptions
                    caption="From"
                    onValueChage={setFromDate}
                    defaultValue={lastConfig?.from}
                />
                <ChartDateOptions
                    caption="To"
                    onValueChage={setToDate}
                    defaultValue={lastConfig?.to}
                />
                <div className="columns">
                    <div className="column is-4">
                        <Dropdown
                            value={type}
                            placeholder="Type"
                            deselectable={true}
                            onSelect={setType}
                            hideOnOuterClick={true}
                            items={availableTypesAsDropdownItems}
                            label={{
                                caption: "Type",
                                horizontal: true,
                            }}
                        />
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <Button
                            type="primary"
                            caption="Show data"
                            onClick={onShowDataClick}
                        />
                    </div>
                </div>
            </nav>
            <hr />
            <section>
                {chartSeriesData.length}
            </section>
        </>
    );
};

export default
    connect(
        ({ payments, stats }: CompositeAppState) => {
            const chartData = stats.charts.get(Chart.Payments);

            return {
                availableTypesAsDropdownItems: payments.availableTypesAsDropdownItems,
                chartSeriesData: chartData?.lastData ?? [],
                lastConfig: chartData?.lastConfig,
            };
        },
        {
            loadTypes: loadTypes,
            loadChartData: loadChartData,
            saveConfig: getSaveChartConfigAction,
        }
    )(PaymentsChart);
