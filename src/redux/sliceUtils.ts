import { isUndefined } from "@bodynarf/utils";
import { PayloadAction } from "@reduxjs/toolkit";

/** Slice state that tracks module initialization */
interface WithInitialized {
    /** Whether the module state has been loaded at least once */
    initialized: boolean;
}

/** Slice state that supports toggling a grouped view */
interface WithGroupedView {
    /** Whether records are displayed in a grouped layout */
    useGroupedView: boolean;
}

/** Slice state that persists the last visited page number */
interface WithLastPage {
    /** Zero-based index of the last visited pagination page */
    lastPage?: number;
}

/**
 * Shared reducer: initialise the module state.
 * Accepted by any slice state that contains `initialized`.
 */
export const setModuleInitializedStateReducer = (
    state: WithInitialized,
    action: PayloadAction<boolean>,
): void => {
    if (!isUndefined(action.payload)) {
        state.initialized = action.payload;
    }
};

/**
 * Shared reducer: toggle grouped view flag.
 * Accepted by any slice state that contains `useGroupedView`.
 */
export const toggleGroupViewReducer = (state: WithGroupedView): void => {
    state.useGroupedView = !state.useGroupedView;
};

/**
 * Shared reducer: persist the last visited page number.
 * Accepted by any slice state that contains `lastPage`.
 */
export const setCurrentPageReducer = (
    state: WithLastPage,
    action: PayloadAction<number>,
): void => {
    state.lastPage = action.payload;
};
