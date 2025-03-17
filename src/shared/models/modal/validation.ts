/** Form field validation configuration */
export interface ModalFormItemValidation {
    /** Custom required validation error */
    customRequiredValidationError?: string;

    /**
     * Custom validation.
     * Function that validates current value. Should return error if value isn"t valid; otherwise - undefined
    */
    customValidation?: (value: string) => string | undefined;
}
