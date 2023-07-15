import { Action } from "@app/redux";
import { CLOSE_MODAL } from "@app/redux/modal";

/**
 * Get redux action "Close modal window"
 * @returns State updating action
 */
export const getCloseModalAction = (): Action => {
    return ({
        type: CLOSE_MODAL,
    });
};
