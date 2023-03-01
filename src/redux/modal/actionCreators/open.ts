import { OpenModal } from "../actions";
import { ModalAction, ModalParams } from "../types";

/**
 * Get redux action "Open modal window"
 * @param params Modal window parameters
 * @returns State updating action
 */
export const getOpenModalAction = (params: ModalParams): ModalAction => {
    return ({
        type: OpenModal,
        params,
    });
};

