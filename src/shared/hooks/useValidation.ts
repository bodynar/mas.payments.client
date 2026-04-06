import { useCallback, useState } from "react";

import { ValidationState, ValidationStatus } from "@bodynarf/react.components";

/** Per-field validation map keyed by field name */
type ValidationMap<TFields extends string> = Partial<Record<TFields, ValidationState>>;

/** Return type of {@link useValidation} */
interface UseValidationResult<TFields extends string> {
    /** Current per-field validation states */
    validation: ValidationMap<TFields>;

    /** Replace the entire validation map (use in onSubmit to set all errors at once) */
    setValidation: (map: ValidationMap<TFields>) => void;

    /** Return an invalid ValidationState with the given message */
    invalid: (message: string) => ValidationState;

    /** Clear the validation state for a single field */
    clearField: (field: TFields) => void;
}

/**
 * Manages per-field form validation state.
 * @template TFields Union of field name strings, e.g. `"amount" | "type"`
 */
export const useValidation = <TFields extends string>(): UseValidationResult<TFields> => {
    const [validation, setValidation] = useState<ValidationMap<TFields>>({});

    const invalid = useCallback(
        (message: string): ValidationState =>
            ({ status: ValidationStatus.Invalid, messages: [message] }),
        [],
    );

    const clearField = useCallback(
        (field: TFields) => setValidation(v => ({ ...v, [field]: undefined })),
        [],
    );

    return { validation, setValidation, invalid, clearField };
};
