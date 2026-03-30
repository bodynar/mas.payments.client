/** Model for adding new measurement type */
export interface AddMeasurementType {
    /** Visual caption */
    name: string;

    /** Identifier of parent payment type */
    paymentTypeId: string;

    /** Background color of badge */
    color?: string;

    /** Description */
    description?: string;
}

/** Model for update existed measurement type */
export interface UpdateMeasurementType extends AddMeasurementType {
    /** Unique identifier of measurement type */
    id: string;
}
