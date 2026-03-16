import { EntityGroup } from "@app/models";

import { Measurement } from ".";

/** Measurements grouped by year-month */
export type MeasurementGroup = EntityGroup<Measurement>;
