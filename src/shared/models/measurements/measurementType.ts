import { Lookup } from "../lookup";

/** Measurement type */
export interface MeasurementType extends Lookup {
     /** Is there any dependant measurements */
    hasRelatedMeasurements: boolean;

    /** Parent payment type identifier */
    paymentTypeId: number;

    /** Parent payment type caption */
    paymentTypeCaption: string;

    /** Parent payment type color */
    paymentTypeColor?: string;
}
