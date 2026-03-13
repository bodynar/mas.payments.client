import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ModalParams, ModalState } from "./types";

const initialState: ModalState = {
    isOpen: false,
};

const modalSlice = createSlice({
    name: "mas.payments/modal",
    initialState,
    reducers: {
        openModal(state, action: PayloadAction<ModalParams>) {
            state.isOpen = true;
            state.modalParams = action.payload;
        },
        closeModal() {
            return { isOpen: false };
        },
    },
});

export const {
    openModal,
    closeModal: closeModalAction,
} = modalSlice.actions;

export default modalSlice.reducer;
