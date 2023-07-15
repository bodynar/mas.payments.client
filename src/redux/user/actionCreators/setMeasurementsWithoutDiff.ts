import { ActionWithPayload } from "@app/redux";
import { SetMeasurementsWithoutDiff } from "@app/redux/user";

/**
 * Get redux action "Set measurements without diff count"
 * @param measurementsCount Amount of measurements without diff
 * @returns Redux action to update state
 */
export const getSetMeasurementsWithoutDiffAction = (measurementsCount: number): ActionWithPayload => ({
    type: SetMeasurementsWithoutDiff,
    payload: { measurementsCount },
});
