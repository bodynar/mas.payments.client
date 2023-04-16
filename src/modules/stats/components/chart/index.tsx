import { useMemo } from "react";

import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

/** Chart component container props type */
interface ChartContainerProps {
    /** Title configuration */
    title: string | ApexOptions["title"];

    /** Values to display on line chart (Y axis) */
    series: ApexOptions["series"];

    /** Horizontal line values (X axis) */
    horizontalAxisValues: Array<string>;
}

/** Chart component container */
const ChartContainer = ({
    title, series, horizontalAxisValues
}: ChartContainerProps): JSX.Element => {
    const options: ApexOptions = useMemo(() => ({
        chart: {
            type: "line",
            height: 400,
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                },
            },
            toolbar: { show: false, },
            zoom: { enabled: false, },
        },
        noData: {
            text: "No data found",
            align: "center",
            verticalAlign: "middle",
            offsetX: 0,
            offsetY: 0,
        },
        xaxis: {
            type: "category",
            categories: horizontalAxisValues,
        },
        title: title instanceof String
            ? { text: title as string }
            : title as ApexOptions["title"],
    }), [horizontalAxisValues, title]);

    return (
        <Chart
            options={options}
            series={series}
        />
    );
};

export default ChartContainer;
