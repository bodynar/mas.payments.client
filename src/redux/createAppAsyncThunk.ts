import { ThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

import { CompositeAppState } from "./types";
import { setAppIsLoading } from "./app/slice";
import { getNotifications } from "./notificator";
import { ShowSuccessFn, ShowErrorFn } from "./notificator/types";

/** Typed thunk dispatch bound to application state */
export type AppThunkDispatch = ThunkDispatch<CompositeAppState, unknown, UnknownAction>;

/** Typed thunk action bound to application state */
export type AppThunkAction<TResult = void> = ThunkAction<TResult, CompositeAppState, unknown, UnknownAction>;

/** Context provided to every app thunk */
interface ThunkContext {
    /** Typed Redux dispatch function */
    dispatch: AppThunkDispatch;

    /** Returns current application state */
    getState: () => CompositeAppState;

    /** Display a success notification to the user */
    showSuccess: ShowSuccessFn;

    /** Display an error notification to the user */
    showError: ShowErrorFn;
}

/**
 * Create a typed async thunk with automatic loading state and error handling.
 * Eliminates boilerplate of manually dispatching setAppIsLoading and getNotifications.
 *
 * - On start: dispatches `setAppIsLoading(true)`
 * - On success: dispatches `setAppIsLoading(false)` and returns result
 * - On error: shows error notification (which clears loading) and returns `undefined`
 *
 * @param fn - Async function receiving {@link ThunkContext} and forwarded arguments
 * @returns A thunk action creator that wraps `fn` with loading/error handling
 *
 * @example
 * export const loadPayments = createAppAsyncThunk(
 *     async ({ dispatch }) => {
 *         const payments = await getPaymentRecords();
 *         dispatch(setPayments(payments));
 *     }
 * );
 */
export const createAppAsyncThunk = <TArgs extends unknown[], TResult = void>(
    fn: (context: ThunkContext, ...args: TArgs) => Promise<TResult>
) => (
    ...args: TArgs
): AppThunkAction<Promise<TResult | undefined>> =>
    async (dispatch: AppThunkDispatch, getState): Promise<TResult | undefined> => {
        dispatch(setAppIsLoading(true));
        const [showSuccess, showError] = getNotifications(dispatch, getState);

        try {
            const result = await fn({ dispatch, getState, showSuccess, showError }, ...args);
            dispatch(setAppIsLoading(false));
            return result;
        } catch (e: unknown) {
            showError(e instanceof Error ? e : new Error(String(e)));
            return undefined;
        }
    };

/**
 * Create a modal callback with automatic loading state and error handling.
 * Same wrapping as {@link createAppAsyncThunk} but designed for use inside
 * `openModal({ callback })` where `dispatch`/`getState` are already captured in closure.
 *
 * @param dispatch - Redux dispatch function from the enclosing thunk
 * @param getState - Redux getState function from the enclosing thunk
 * @param fn - Async function receiving {@link ThunkContext} to execute after modal confirmation
 * @returns An async callback suitable for modal's `callback` property
 *
 * @example
 * dispatch(openModal({
 *     modalType: ModalType.Confirm,
 *     callback: createModalCallback(dispatch, getState, async ({ showSuccess }) => {
 *         await deleteRecordAction(id);
 *         showSuccess("Deleted", false);
 *     }),
 * }));
 */
export const createModalCallback = (
    dispatch: AppThunkDispatch,
    getState: () => CompositeAppState,
    fn: (context: ThunkContext) => Promise<void>,
): (() => Promise<void>) =>
    async (): Promise<void> => {
        dispatch(setAppIsLoading(true));
        const [showSuccess, showError] = getNotifications(dispatch, getState);

        try {
            await fn({ dispatch, getState, showSuccess, showError });
            dispatch(setAppIsLoading(false));
        } catch (e: unknown) {
            showError(e instanceof Error ? e : new Error(String(e)));
        }
    };
