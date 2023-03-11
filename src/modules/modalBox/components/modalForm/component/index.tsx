import { useCallback, useState } from "react";

import { isNullOrUndefined } from "@bodynarf/utils";

import "./style.scss";

import { ModalFormConfiguration } from "@app/models/modal";

import ModalFormText from "../components/text";
import Multiline from "../components/multiline";

interface ModalFormProps {
    /** Form configuration */
    formConfig: ModalFormConfiguration;

    /** Handler of field calculating validation result */
    setSaveButtonDisabled: (isValid: boolean) => void;
}

/** Field validation state */
interface FormFieldValidationState {
    /** Field name */
    fieldName: string;

    /** Validation status */
    isValid: boolean;
}

/**
 * Modal form container component
 * @throws Form configuration does not contain any field
 */
const ModalForm = ({ formConfig, setSaveButtonDisabled }: ModalFormProps): JSX.Element => {
    if (formConfig.fields.length === 0) {
        throw new Error("No field provided for ModalForm");
    }

    const requiredFields: Array<FormFieldValidationState> =
        formConfig.fields
            .filter(field => field.isRequired === true)
            .map(({ name }) => ({ fieldName: name, isValid: false }));

    const [fieldValidStates, setFieldValidStates] = useState<Array<FormFieldValidationState>>(requiredFields);

    const setFieldValidState = useCallback(
        (fieldName: string, isValid: boolean) => {
            if (isValid) {
                const hasInvalidField: boolean =
                    fieldValidStates.some(x => x.fieldName !== fieldName && !x.isValid);

                setSaveButtonDisabled(hasInvalidField);
            } else {
                setSaveButtonDisabled(true);
            }

            const updatedStatesArray: Array<FormFieldValidationState> =
                fieldValidStates.map(x =>
                    x.fieldName === fieldName ? ({ fieldName, isValid }) : x);

            setFieldValidStates([...updatedStatesArray]);
        }, [fieldValidStates, setSaveButtonDisabled]);

    return (
        <>
            {!isNullOrUndefined(formConfig.caption)
                && <h3>{formConfig.caption}</h3>
            }
            {formConfig.fields.map(fieldConfig => {
                if (fieldConfig.type === "text") {
                    return <ModalFormText
                        key={fieldConfig.name}
                        fieldConfig={fieldConfig}
                        setFieldValidState={setFieldValidState}
                    />;
                } else if (fieldConfig.type === "multiline") {
                    return <Multiline
                        key={fieldConfig.name}
                        fieldConfig={fieldConfig}
                        setFieldValidState={setFieldValidState}
                    />;
                }
                else {
                    console.error(`Field type ${fieldConfig.type} is not supported at the moment.`);
                    return <span key={fieldConfig.name}>Error during form building</span>;
                }
            })}
        </>
    );
};

export default ModalForm;
