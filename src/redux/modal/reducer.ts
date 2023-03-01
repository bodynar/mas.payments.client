import { isNullOrUndefined, getPropertyValueWithCheck } from "@bodynarf/utils";

import { ModalAction, ModalParams, ModalState, OpenModal, CloseModal } from "@app/redux/modal";

/** Initial state of modal module */
const initialState: ModalState = {
    isOpen: false,
    modalParams: {
        modalType: "info",
        title: "Modal title"
    }
};

/** Modal box module reducer function */
export default function (state = initialState, action: ModalAction): ModalState {
    switch (action.type) {
        case OpenModal: {
            const modalParams: ModalParams = getPropertyValueWithCheck(action, "params", false);

            if (isNullOrUndefined(modalParams)) {
                // TODO: v2 log warning
                return state;
            }

            return {
                ...state,
                isOpen: true,
                modalParams
            };
        }
        case CloseModal: {
            return {
                ...state,
                isOpen: false
            };
        }
        default:
            return state;
    }
}
