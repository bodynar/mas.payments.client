import { isNullOrEmpty, isNullish, isNotNullish, isStringEmpty } from "@bodynarf/utils";

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

    if (isNotNullish(modalParams.buttonCaption) && !isNullOrEmpty(modalParams.buttonCaption!.saveCaption)) {
        result.saveBtnCaption = modalParams.buttonCaption!.saveCaption!;
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

    switch (modalParams.modalType) {
        case ModalType.Confirm:
            return validateConfirmModalType(modalParams);
        case ModalType.Info:
            return validateInfoModalType(modalParams);
        default:
            return undefined;
    }
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

    if (isNullish(modalConfig.callback)) {
        return "Callback is not defined.";
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
