import { TabItem } from "@bodynarf/react.components";

import { Chart } from "@app/models/stats";

/** Stats module available charts */
export const tabsConfig: Array<TabItem> = [
    {
        caption: "Payments",
        id: Chart.Payments,
    },
    {
        caption: "Measurements",
        id: Chart.Measurements,
    }
];
