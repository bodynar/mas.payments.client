import { ActionWithPayload } from "@app/redux";
import { ModalParams, OPEN_MODAL } from "@app/redux/modal";

/**
 * Get redux action "Open modal window"
 * @param params Modal window parameters
 * @returns State updating action
 */
export const getOpenModalAction = (params: ModalParams): ActionWithPayload => {
    return ({
        type: OPEN_MODAL,
        payload: {
            params,
        },
    });
};

