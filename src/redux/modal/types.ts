/** Type of displaying modal */
export enum ModalType {
    /** Display some textual information */
    Info = "info",

    /** Display modal with confirm message and 2 optional buttons */
    Confirm = "confirm",
}

/** Modal box module state */
export interface ModalState {
    /** Is modal box displaying */
    isOpen: boolean;

    /** Last modal box params */
    modalParams?: ModalParams;
}

/** Modal box configuration params */
export interface ModalParams {
    /** Modal box title */
    title: string;

    /** Modal type */
    modalType: ModalType;

    /** Modal message */
    message?: string;

    /** Modal button caption configuration */
    buttonCaption?: {
        /**
         * Save button caption.
         * Button visible only in confirm modal type
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
}

/** Modal callback after close configuration */
export interface ModalCallback {
    /** Callback for closing modal on clicking Save button */
    saveCallback?: (modalData: ModalCloseData) => void;

    /** Callback for closing modal on clicking Cancel button */
    cancelCallback?: (modalData: ModalCloseData) => void;
}

/** Modal close data params */
export interface ModalCloseData {
    /**
     * Close reason.
     * Cross sign (x on the top right) will be evaluated as cancel
     */
    closeCode: "save" | "cancel";

}
