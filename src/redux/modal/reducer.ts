import { isNullOrUndefined, getPropertyValueWithCheck } from "@bodynarf/utils";

import { ActionWithPayload } from "@app/redux";
import { ModalParams, ModalState, OPEN_MODAL, CLOSE_MODAL } from "@app/redux/modal";

/** Initial state of modal module */
const initialState: ModalState = {
    isOpen: false
};

/** Modal box module reducer function */
export default function (state = initialState, action: ActionWithPayload): ModalState {
    switch (action.type) {
        case OPEN_MODAL: {
            const modalParams: ModalParams = getPropertyValueWithCheck(action.payload, "params", false);

            if (isNullOrUndefined(modalParams)) {
                // TODO: v2 log warning
                return state;
            }

            return {
                isOpen: true,
                modalParams
            };
        }
        case CLOSE_MODAL: {
            return {
                isOpen: false
            };
        }
        default:
            return state;
    }
}
