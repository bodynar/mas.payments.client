import { useCallback, useEffect, useState } from "react";

import { connect } from "react-redux";

import { ElementColor, SelectableItem } from "@bodynarf/react.components";
import Button from "@bodynarf/react.components/components/button";
import Dropdown from "@bodynarf/react.components/components/dropdown";
import Icon from "@bodynarf/react.components/components/icon";
import Accordion from "@app/sharedComponents/accordion";

import { LookupDate } from "@app/models";
import { Chart } from "@app/models/stats";

import { CompositeAppState } from "@app/redux";
import { loadTypes } from "@app/redux/measurements";
import { getSaveChartConfigAction, getSaveChartConfigPanelVisibilityAction, loadChartData } from "@app/redux/stats";

import ChartDateOptions from "../chartDateOptions";
import { ChartComponentProps } from "../types";
import ChartContainer from "../chart";

/** Payments chart component props type */
interface MeasurementsChartProps extends ChartComponentProps { }

/** Payments chart component */
const MeasurementsChart = ({
    availableTypesAsDropdownItems,
    loadTypes, loadChartData, saveConfig,
    chartSeriesData, lastConfig,
    saveChartConfigPanelVisibility,
}: MeasurementsChartProps): JSX.Element => {
    useEffect(() => {
        if (availableTypesAsDropdownItems.length === 0) {
            loadTypes();
        }
    }, [loadTypes, availableTypesAsDropdownItems]);

    const [fromDate, setFromDate] = useState<LookupDate>(lastConfig?.from ?? {});
    const [toDate, setToDate] = useState<LookupDate>(lastConfig?.to ?? {});
    const [type, setType] = useState<SelectableItem | undefined>(lastConfig?.type);

    const onConfigPanelVisibilityToggle = useCallback((collapsed: boolean) => saveChartConfigPanelVisibility(Chart.Measurements, collapsed), [saveChartConfigPanelVisibility]);
    const onShowDataClick = useCallback(
        () =>
            loadChartData({
                chart: Chart.Measurements,
                from: fromDate,
                to: toDate,
                type: type,
                configIsCollapsed: lastConfig?.configIsCollapsed ?? false,
            }),
        [fromDate, lastConfig?.configIsCollapsed, loadChartData, toDate, type]
    );

    useEffect(
        () => {
            saveConfig({
                chart: Chart.Measurements,
                from: fromDate,
                to: toDate,
                type: type,
                configIsCollapsed: lastConfig?.configIsCollapsed ?? false,
            });
        },
        [fromDate, lastConfig?.configIsCollapsed, saveConfig, toDate, type]
    );

    if (availableTypesAsDropdownItems.length === 0) {
        return <></>;
    }

    return (
        <>
            <Accordion
                caption="Configuration"
                style={ElementColor.Info}
                onToggle={onConfigPanelVisibilityToggle}
                defaultExpanded={!lastConfig?.configIsCollapsed ?? true}
            >
                <nav className="block">
                    <div className="block is-italic	">
                        <p>
                            <Icon name="question-circle" className="mr-1" />
                            Displays change of measurement difference through time
                        </p>
                    </div>
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
            </Accordion>
            <hr />
            <section>
                <ChartContainer
                    title="Measurements"
                    series={chartSeriesData.map(({ key, data }) => ({
                        name: key,
                        data: Array.from(data, ([x, y]) => ({ x, y }))
                    }))}
                />
            </section>
        </>
    );
};

export default
    connect(
        ({ measurements, stats }: CompositeAppState) => {
            const chartData = stats.charts.get(Chart.Measurements);

            return {
                availableTypesAsDropdownItems: measurements.availableTypesAsDropdownItems,
                chartSeriesData: chartData?.lastData ?? [],
                lastConfig: chartData?.lastConfig,
            };
        },
        {
            loadTypes: loadTypes,
            loadChartData: loadChartData,
            saveConfig: getSaveChartConfigAction,
            saveChartConfigPanelVisibility: getSaveChartConfigPanelVisibilityAction,
        }
    )(MeasurementsChart);
