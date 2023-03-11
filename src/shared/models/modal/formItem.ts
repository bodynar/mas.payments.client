import { ModalFormItemValidation } from "./validation";

/** Types of available form fields */
export enum ModalFormItemType {
    /** Single line text input */
    Text = "text",

    /** Multi line text input */
    Multiline = "multiline",

    /** Date input */
    Date = "date",

    /** Number input */
    Number = "number",
}

/** Minimal modal form item data */
export interface ModalFormItemData {
    /** Unique name */
    name: string;

    /** Value as string */
    value?: string;
}

/** Form field configuration */
export interface ModalFormItem extends ModalFormItemData {
    /** Caption */
    caption: string;

    /** Field type. Native control will use that type to match own type */
    type: ModalFormItemType;

    /** Should field be readonly */
    disabled?: boolean;

    /** Should field be required */
    isRequired?: boolean;

    /** Validation configuration. If provided field will be marked as required */
    validationConfiguration?: ModalFormItemValidation;
}
