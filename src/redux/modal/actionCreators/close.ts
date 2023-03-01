import { CloseModal } from "../actions";
import { ModalAction } from "../types";

/**
 * Get redux action "Close modal window"
 * @returns State updating action
 */
export const getCloseModalAction = (): ModalAction => {
    return ({
        type: CloseModal,
    });
};

