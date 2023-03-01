import { CloseModal, ModalAction } from "@app/redux/modal";

/**
 * Get redux action "Close modal window"
 * @returns State updating action
 */
export const getCloseModalAction = (): ModalAction => {
    return ({
        type: CloseModal,
    });
};

