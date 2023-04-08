/** Model for adding new measurement type */
export interface AddMeasurementType {
    /** Visual caption */
    name: string;

    /** Unique number of parent payment type */
    paymentTypeId: number;

    /** Background color of badge */
    color?: string;

    /** Description */
    description?: string;
}

/** Model for update existed measurement type */
export interface UpdateMeasurementType extends AddMeasurementType {
    /** Unique number of measurement type */
    id: number;
}
