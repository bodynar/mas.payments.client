import { useCallback, useState } from "react";

import { getClassName, isNullOrUndefined } from "@bodynarf/utils";
import { ValidationStatus } from "@bodynarf/react.components";
import Multiline from "@bodynarf/react.components/components/primitives/multiline";

import { getFieldValueValidationError } from "../../utils";

import { BaseFieldProps } from "../basePropsType";

/** Multiline form editor component */
export default function ModalFormMultiline({ fieldConfig, setFieldValidState }: BaseFieldProps): JSX.Element {
	const [value, setValue] = useState<string>(fieldConfig.value || "");
	const [isDirty, setIsDirty] = useState<boolean>(false);
	const [validationError, setValidationError] = useState<string | undefined>();

	const validate = useCallback(
		(value: string, isDirty: boolean) => {
			if (isDirty && fieldConfig.isRequired === true) {
				const error: string | undefined = getFieldValueValidationError(value, fieldConfig.validationConfiguration);

				setValidationError(error);
				setFieldValidState(fieldConfig.name, isNullOrUndefined(error));
			}
		}, [fieldConfig.isRequired, fieldConfig.name, fieldConfig.validationConfiguration, setFieldValidState]);

	const onValueChange = useCallback(
		(newValue?: string) => {
			let isFieldDirty: boolean = isDirty;

			if (newValue !== value) {
				setIsDirty(true);
				isFieldDirty = true;
			}

			fieldConfig.value = newValue;
			setValue(newValue ?? "");
			validate(newValue ?? "", isFieldDirty);
		}, [fieldConfig, isDirty, validate, value]
	);

	const labelClassName: string = getClassName([
		fieldConfig.isRequired === true ? "is-required" : "",
	]);

	const validationState = isNullOrUndefined(validationError)
		? { status: ValidationStatus.None, messages: [] }
		: { status: ValidationStatus.Invalid, messages: [validationError!] };

	return (
		<Multiline
			onValueChange={onValueChange}
			defaultValue={value}
			placeholder={fieldConfig.caption}
			disabled={fieldConfig.disabled}
			name={fieldConfig.name}
			label={{
				className: labelClassName,
				caption: fieldConfig.caption || fieldConfig.name,
				horizontal: false,
			}}
			validationState={validationState}
		/>
	);
}
