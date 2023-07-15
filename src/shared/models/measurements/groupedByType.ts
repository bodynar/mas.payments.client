import { Group } from "@bodynarf/utils";

import { Measurement } from ".";

/** Measurements grouped by `typeId` */
export interface MeasurementGroupedByType extends Group<Measurement> { }
