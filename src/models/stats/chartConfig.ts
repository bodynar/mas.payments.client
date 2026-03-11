import { SelectableItem } from "@bodynarf/react.components";

import { LookupDate } from "@app/models";

import { Chart } from ".";

/** Chart config data */
export interface ChartConfig {
    /** Chart key */
    chart: Chart;

    /** Left date corridor border */
    from?: LookupDate;

    /** Right date corridor border */
    to?: LookupDate;

    /** Selected type to filter series */
    type?: SelectableItem;

    /** Is configuration block hidden */
    configIsCollapsed?: boolean;
}
