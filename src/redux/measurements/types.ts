import { Group } from "@bodynarf/utils";

import { MeasurementType, Measurement, MeasurementFilter } from "@app/models/measurements";

import { EntityModuleState } from "../types";

/** Measurement module state */
export interface MeasurementModuleState extends EntityModuleState<Measurement, MeasurementType, MeasurementFilter> {
    /** All measurements grouped by type */
    groupedByType?: Array<Group<Measurement>>;
}
