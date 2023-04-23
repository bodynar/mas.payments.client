import { SelectableItem } from "@bodynarf/react.components";

import { Chart, ChartConfig, ChartData } from "@app/models/stats";

/** Base for chart components props */
export interface ChartComponentProps {
    /** Types mapped to dropdown items to cache values */
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

    /** Save config panel visibility state */
    saveChartConfigPanelVisibility: (chart: Chart, collapsed: boolean) => void;
}
