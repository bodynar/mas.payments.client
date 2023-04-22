import { useMemo } from "react";

import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

/** Chart component container props type */
interface ChartContainerProps {
    /** Title configuration */
    title: string;

    /** Values to display on line chart (Y axis) */
    series: ApexOptions["series"];
}

/** Chart component container */
const ChartContainer = ({
    title, series,
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
        title: { text: title as string },
    }), [title]);

    return (
        <Chart
            options={options}
            series={series}
        />
    );
};

export default ChartContainer;
