import { ModalFormItem } from "@app/models/modal";

/** Base field editor props */
export type BaseFieldProps = {
    /** Field configuration */
    fieldConfig: ModalFormItem;

    /**
     * Additional handler for validating field value.
     * Required for changing modal form save button accessibility.
    */
    setFieldValidState: (fieldName: string, isValid: boolean) => void;
};
