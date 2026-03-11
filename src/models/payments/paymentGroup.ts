import { EntityGroup } from "@app/models";

import { Payment } from ".";

/** Payments grouped by year-month */
export type PaymentGroup = EntityGroup<Payment>;
