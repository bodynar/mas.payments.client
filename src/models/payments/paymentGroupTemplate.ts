/** Payment type within a group template */
export interface PaymentGroupTemplatePaymentType {
    /** Payment type identifier */
    paymentTypeId: string;

    /** Payment type name */
    paymentTypeName: string;

    /** Payment type color */
    paymentTypeColor?: string | null;

    /** Payment type company */
    paymentTypeCompany?: string | null;
}

/** Payment group template */
export interface PaymentGroupTemplate {
    /** Unique identifier */
    id: string;

    /** Template name */
    name: string;

    /** Template description */
    description: string;

    /** Number of payment types in template */
    paymentTypesCount: number;

    /** Payment types included in template */
    paymentTypes: Array<PaymentGroupTemplatePaymentType>;
}

/** Model for adding new payment group template */
export interface AddPaymentGroupTemplate {
    /** Template name */
    name: string;

    /** Template description */
    description: string;

    /** Payment type identifiers */
    paymentTypeIds: Array<string>;
}

/** Model for updating payment group template */
export interface UpdatePaymentGroupTemplate extends AddPaymentGroupTemplate {
    /** Unique identifier */
    id: string;
}
