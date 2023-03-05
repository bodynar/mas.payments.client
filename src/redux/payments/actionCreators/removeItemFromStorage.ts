import { ActionWithPayload } from "@app/redux";
import { removeItemFromStorage } from "@app/redux/payments";

/**
 * Get redux action "Remove item from storage"
 * @param id Payment record identifier
 * @returns Redux action to update state
 */
export const getRemoveItemFromStorage = (id: number): ActionWithPayload => ({
    type: removeItemFromStorage,
    payload: { id },
});
