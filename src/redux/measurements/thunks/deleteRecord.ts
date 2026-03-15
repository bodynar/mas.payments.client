import { AppThunkAction, AppThunkDispatch, createModalCallback } from "@app/redux/createAppAsyncThunk";
import { CompositeAppState } from "@app/redux";
import { openModal, ModalType } from "@app/redux/modal";
import { setMeasurements } from "@app/redux/measurements";

import { getMonthName } from "@app/utils";
import { getMeasurements, deleteMeasurement } from "@app/core/measurement";

/**
 * Delete specified measurement via confirmation modal
 */
export const deleteRecord = (id: number): AppThunkAction => (
    dispatch: AppThunkDispatch,
    getState: () => CompositeAppState
): void => {
    const { measurements } = getState();
    const item = measurements.measurements.find((x) => x.id === id)!;
    const typeCaption = measurements.typesMap.get(item.typeId)?.caption ?? "";

    dispatch(
        openModal({
            modalType: ModalType.Confirm,
            title: "Confirm deleting measurement",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure you want to delete measurement record for ${getMonthName(item.month)} ${item.year} [${typeCaption}]?`,
            callback: createModalCallback(dispatch, getState, async ({ showSuccess }) => {
                await deleteMeasurement(id);
                showSuccess("Measurement record successfully deleted", false);
                const items = await getMeasurements();
                dispatch(setMeasurements(items));
            }),
        })
    );
};
