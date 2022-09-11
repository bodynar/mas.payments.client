import { Lookup } from "../lookup";

/** Payment type */
export interface PaymentType extends Lookup {
    /** Is there any dependant payments */
    hasRelatedPayments: boolean;

    /** Is there any dependant measurement types */
    hasRelatedMeasurementTypes: boolean;

    /** Provider name */
    company?: string;
}
