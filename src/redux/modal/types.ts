import { Action } from "@app/redux/types";

import { ModalFormConfiguration, ModalFormItemData } from "@app/modules/modalBox/components/modalForm/types";

/** Type of displaying modal */
export type ModalType =
    | 'info' /** Display some textual information */
    | 'form' /** Display some form to fill */
    | 'confirm' /** Display modal with confirm message and 2 optional buttons */
    ;

/** Modal box module state */
export type ModalState = {
    /** Is modal box displaying */
    isOpen: boolean;

    /** Last modal box params */
    modalParams?: ModalParams;
};

/** Modal box congifuration params */
export type ModalParams = {
    /** Modal box title */
    title: string;

    /** Modal type */
    modalType: ModalType;

    /** 
     * Modal box form configuration.
     * Applies only to form modal type
    */
    formData?: ModalFormConfiguration;

    /**
     * Modal message.
     * Applies only to info and confirm modal types
    */
    message?: string;

    /** Modal button caption configuration */
    buttonCaption?: {
        /**
         * Save button caption.
         * Button visible only in form and confirm modal type
        */
        saveCaption?: string;

        /** Cancel button caption */
        cancelCaption?: string;
    };

    /**
     * Callback modal configuration.
     * Will be invoked after modal close
    */
    callback?: ModalCallback;
};

/** Modal callback after close configuration */
export type ModalCallback = {
    /** Callback for closing modal on clicking Save button */
    saveCallback?: (modalData: ModalCloseData) => void;

    /** Callback for closing modal on clicking Cancel button */
    cancelCallback?: (modalData: ModalCloseData) => void;
};

/** Modal close data params */
export type ModalCloseData = {
    /** 
     * Close reason.
     * Cross sign (x on the top right) will be evaluated as cancel
     */
    closeCode: 'save' | 'cancel';

    /** Form data state */
    formData?: {
        /** Form fields states */
        fields: Array<ModalFormItemData>;
    };
};

/** Modal box redux action */
export type ModalAction = Action & {
    /**
     * Modal params.
     * Applies only to show action
    */
    params?: ModalParams;
};
