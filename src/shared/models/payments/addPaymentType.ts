/** Model for adding new payment type */
export interface AddPaymentType {
    /** Visual caption */
    name: string;

    /** Provider name */
    company?: string;
    
    /** Background color of badge */
    color?: string;

    /** Description */
    description?: string;
}

/** Model for update existed payment type */
export interface UpdatePaymentType extends AddPaymentType {
    /** Unique number of payment type */
    id: number;
}
