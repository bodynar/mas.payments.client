import { isNullOrEmpty, isNullOrUndefined, isStringEmpty } from "@bodynarf/utils/common";

import { ModalFormItemValidation } from "./types";

/**
 * Validate field value
 * @param value Field value which needs to be validated
 * @param validationCfg Field validation configuration
 * @returns Validation error if field value is not valid; otherwise undefuned
 */
export const getFieldValueValidationError = (value: string, validationCfg?: ModalFormItemValidation): string | undefined => {
    let validationError = "Value is required";
    let validator: (value: string) => string | undefined =
        (value: string): string | undefined => isStringEmpty(value) ? validationError : undefined;

    if (!isNullOrUndefined(validationCfg)) {
        const cfg = validationCfg as ModalFormItemValidation;

        if (!isNullOrEmpty(cfg.customRequiredvalidationError)) {
            validationError = cfg.customRequiredvalidationError as string;
        }

        if (!isNullOrUndefined(cfg.customValidation)) {
            validator = cfg.customValidation as (value: string) => string | undefined;
        }
    }

    const error: string | undefined = validator(value);

    return error;
};
