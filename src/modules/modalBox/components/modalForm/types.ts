/** Modal form configuration */
interface ModalFormConfiguration {
    /** Form fields configuration */
    fields: Array<ModalFormItem>;

    /** Optional caption. Will be shown if provided */
    caption?: string;
}

/** Types of available form fields */
type ModalFormItemType =
    | 'text'
    | 'multiline'
    | 'date'
    | 'number'
    ;


interface ModalFormItemData {
    /** Unique name */
    name: string;

    /** Value as string */
    value?: string;
}

/** Form field configuration */
interface ModalFormItem extends ModalFormItemData {
    /** Caption */
    caption: string;

    /** Should field be readonly */
    disabled?: boolean;

    /** Field type. Native control will use that type to match own type */
    type: ModalFormItemType;

    /** Should field be required */
    isRequired?: boolean;

    /** Validation configuration. If provided field will be marked as required */
    validationConfiguration?: ModalFormItemValidation;
}

/** Form field validation configuration */
interface ModalFormItemValidation {
    /** Custom required validation error */
    customRequiredvalidationError?: string;

    /** 
     * Custom validation.
     * Function that validates current value. Should return error if value isn't valid; otherwise - undefined
    */
    customValidation?: (value: string) => string | undefined;
}

export {
    ModalFormConfiguration,
    ModalFormItemType,
    ModalFormItemData,
    ModalFormItem,
    ModalFormItemValidation,
};
