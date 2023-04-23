import { Chart } from "@app/models/stats";

import { ActionWithPayload } from "@app/redux";
import { SAVE_CONFIG_PANEL_VISIBILITY } from "@app/redux/stats";

/**
 * Build redux action for saving chart config data
 * @param chartKey Unique chart key
 * @param collapsed Is config panel collapsed
 * @returns Redux-action
 */
export const getSaveChartConfigPanelVisibilityAction = (chart: Chart, collapsed: boolean): ActionWithPayload => {
    return {
        type: SAVE_CONFIG_PANEL_VISIBILITY,
        payload: { chartKey: chart, collapsed }
    };
};
