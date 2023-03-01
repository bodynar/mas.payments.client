import { isNullOrEmpty, isNullOrUndefined, isStringEmpty } from "@bodynarf/utils";

import { ModalParams } from "@app/redux/modal";

import { ModalFormConfiguration, ModalFormItem } from "./components/modalForm/types";

/**
 * Get button captions for modal box depending on modal params
 * @param modalParams Params of modal box
 * @returns Object with modal box button captions
 */
export const getButtonCaptions = (modalParams: ModalParams | undefined): {
    saveBtnCaption: string,
    cancelBtnCaption: string;
} => {
    const result: {
        saveBtnCaption: string,
        cancelBtnCaption: string;
    } = {
        saveBtnCaption: "Save",
        cancelBtnCaption: modalParams?.modalType === "confirm" ? "Cancel" : "Close"
    };

    if (!isNullOrUndefined(modalParams) && !isNullOrUndefined(modalParams?.buttonCaption)) {
        if (!isNullOrEmpty(modalParams?.buttonCaption?.saveCaption)) {
            result.saveBtnCaption = modalParams?.buttonCaption?.saveCaption as string;
        }
        if (!isNullOrEmpty(modalParams?.buttonCaption?.cancelCaption)) {
            result.cancelBtnCaption = modalParams?.buttonCaption?.cancelCaption as string;
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
        return "Modal title is empty.";
    }

    if (modalParams.modalType === "form") {
        if (isNullOrUndefined(modalParams.formData)) {
            return "Form data is not defined.";
        }
        if (modalParams.formData?.fields.length === 0) {
            return "Form data fields array is empty.";
        }

        const invalidItems: Array<ModalFormItem> | undefined =
            modalParams.formData?.fields.map((x, index) => ({ ...x, position: index })).filter(
                item =>
                    isStringEmpty(item.name) || isStringEmpty(item.caption)
            );

        if (invalidItems?.length !== 0) {
            return `Form configuration contains invalid fields, see items at next positions: [${invalidItems?.join(", ")}].`;
        }

        if (isNullOrUndefined(modalParams.callback)
            || isNullOrUndefined(modalParams.callback?.saveCallback)
        ) {
            return "Callback is not defined.";
        }
    } else if (modalParams.modalType === "confirm") {
        if (isNullOrUndefined(modalParams.message)) {
            return "Confirm message is not defined.";
        }

        if (isStringEmpty(modalParams.message as string)) {
            return "Confirm message is empty";
        }

        if (isNullOrUndefined(modalParams.callback)
            || isNullOrUndefined(modalParams.callback?.saveCallback)
            || isNullOrUndefined(modalParams.callback?.cancelCallback)
        ) {
            return "Callback is not defined.";
        }
    } else {
        if (isNullOrUndefined(modalParams.message)) {
            return "Modal message is not defined.";
        }
        if (isStringEmpty(modalParams.message as string)) {
            return "Modal message is empty.";
        }
    }

    return undefined;
};

/**
 * Get initial value for save button disabled flag
 * @param params Modal window configuration params
 * @returns Initial disabled flag value for save button
 */
export const getInitIsSaveButtonDisabled = (params: ModalParams): boolean => {
    if (params.modalType === "form"
        && !isNullOrUndefined(params.formData)
    ) {
        return (params.formData as ModalFormConfiguration)
            .fields
            .some(field => field.isRequired === true && isNullOrEmpty(field.value));
    }

    return false;
};
