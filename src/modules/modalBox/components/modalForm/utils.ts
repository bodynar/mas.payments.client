import { isNullOrEmpty, isNotNullish, isStringEmpty } from "@bodynarf/utils";

import { ModalFormItemValidation } from "@app/models/modal";

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

    if (isNotNullish(validationCfg)) {
        if (!isNullOrEmpty(validationCfg!.customRequiredValidationError)) {
            validationError = validationCfg!.customRequiredValidationError as string;
        }

        if (isNotNullish(validationCfg!.customValidation)) {
            validator = validationCfg!.customValidation as (value: string) => string | undefined;
        }
    }

    const error: string | undefined = validator(value);

    return error;
};
