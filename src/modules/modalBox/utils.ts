import { isNullOrEmpty, isNullOrUndefined, isStringEmpty } from "@bodynarf/utils";

import { ModalFormItem } from "@app/models/modal";

import { ModalParams, ModalType } from "@app/redux/modal";

/**
 * Get button captions for modal box depending on modal params
 * @param modalParams Params of modal box
 * @returns Object with modal box button captions
 */
export const getButtonCaptions = (modalParams: ModalParams): {
    saveBtnCaption: string,
    cancelBtnCaption: string;
} => {
    const result: {
        saveBtnCaption: string,
        cancelBtnCaption: string;
    } = {
        saveBtnCaption: "Save",
        cancelBtnCaption: modalParams.modalType === ModalType.Confirm ? "Cancel" : "Close"
    };

    if (!isNullOrUndefined(modalParams.buttonCaption)) {
        if (!isNullOrEmpty(modalParams.buttonCaption!.saveCaption)) {
            result.saveBtnCaption = modalParams.buttonCaption!.saveCaption!;
        }
        if (!isNullOrEmpty(modalParams.buttonCaption!.cancelCaption)) {
            result.cancelBtnCaption = modalParams.buttonCaption!.cancelCaption!;
        }
    }

    return result;
};

/**
 * Validate modal window configuration params
 * @param modalParams Modal window configuration params
 * @returns Params validation error is found; otherwise undefined
 */
export const validateModalParams = (modalParams: ModalParams): string | undefined => {
    if (isStringEmpty(modalParams.title)) {
        return "Title is empty.";
    }

    const isValidatorDeclared = modalTypeToValidateParamFuncMap.has(modalParams.modalType);

    if (isValidatorDeclared) {
        const errorFromValidator = modalTypeToValidateParamFuncMap.get(modalParams.modalType)!(modalParams);

        return errorFromValidator;
    }

    return undefined;
};

/**
 * Get initial value for save button disabled flag
 * @param params Modal window configuration params
 * @returns Initial disabled flag value for save button
 */
export const getInitIsSaveButtonDisabled = (params: ModalParams): boolean => {
    if (params.modalType === ModalType.Form
        && !isNullOrUndefined(params.formData)
    ) {
        return params.formData!
            .fields
            .some(field => field.isRequired === true && isNullOrEmpty(field.value));
    }

    return false;
};

/**
 * Validate modal configuration for `ModalType.Form` type
 * @param modalConfig Modal open configuration
 * @returns Error message if config isn't correct; otherwise - `undefined`
 */
const validateFormModalType = (modalConfig: ModalParams): string | undefined => {
    if (isNullOrUndefined(modalConfig.formData)) {
        return "Form data is not defined.";
    }
    if (modalConfig.formData!.fields.length === 0) {
        return "Form data fields array is empty.";
    }

    const invalidItems: Array<ModalFormItem> =
        modalConfig.formData!.fields
            .map((x, index) => ({ ...x, position: index }))
            .filter(item => isStringEmpty(item.name) || isStringEmpty(item.caption));

    if (invalidItems.length !== 0) {
        return `Form configuration contains invalid fields: [${invalidItems.map(({ name }) => name).join(", ")}].`;
    }

    if (isNullOrUndefined(modalConfig.callback)
        || isNullOrUndefined(modalConfig.callback!.saveCallback)
    ) {
        return "Callback is not defined.";
    }

    return undefined;
};

/**
 * Validate modal configuration for `ModalType.Confirm` type
 * @param modalConfig Modal open configuration
 * @returns Error message if config isn't correct; otherwise - `undefined`
 */
const validateConfirmModalType = (modalConfig: ModalParams): string | undefined => {
    if (isNullOrEmpty(modalConfig.message)) {
        return "Message is not defined or empty.";
    }

    if (isNullOrUndefined(modalConfig.callback)
        || isNullOrUndefined(modalConfig.callback!.saveCallback)
        || isNullOrUndefined(modalConfig.callback!.cancelCallback)
    ) {
        return "Callbacks are not defined.";
    }

    return undefined;
};

/**
 * Validate modal configuration for `ModalType.Info` type
 * @param modalConfig Modal open configuration
 * @returns Error message if config isn't correct; otherwise - `undefined`
 */
const validateInfoModalType = (modalConfig: ModalParams): string | undefined => {
    if (isNullOrEmpty(modalConfig.message)) {
        return "Message is not defined or empty.";
    }

    return undefined;
};

/**
 * Map for modal type to validator params.
 * Contains custom validators of modal params for specific modal types
 */
const modalTypeToValidateParamFuncMap = new Map<ModalType, (modalParams: ModalParams) => string | undefined>([
    [ModalType.Form, validateFormModalType],
    [ModalType.Confirm, validateConfirmModalType],
    [ModalType.Info, validateInfoModalType],
]);
