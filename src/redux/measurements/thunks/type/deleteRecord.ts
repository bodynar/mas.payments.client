import { AppThunkAction, AppThunkDispatch, createModalCallback } from "@app/redux/createAppAsyncThunk";
import { CompositeAppState } from "@app/redux";
import { openModal, ModalType } from "@app/redux/modal";
import { setMeasurementTypes } from "@app/redux/measurements";

import { deleteTypeRecord as deleteRecordAction, getMeasurementTypes } from "@app/core/measurement";

/**
 * Delete specified measurement type via confirmation modal
 */
export const deleteTypeRecord = (id: number): AppThunkAction => (
    dispatch: AppThunkDispatch,
    getState: () => CompositeAppState
): void => {
    const { measurements } = getState();
    const measurementType = measurements.typesMap.get(id)!;

    dispatch(
        openModal({
            modalType: ModalType.Confirm,
            title: "Confirm deleting measurement type",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure you want to delete measurement type ${measurementType.caption}?`,
            callback: createModalCallback(dispatch, getState, async ({ showSuccess }) => {
                await deleteRecordAction(id);
                showSuccess(`Measurement type [${measurementType.caption}] successfully deleted`, false);
                const items = await getMeasurementTypes();
                dispatch(setMeasurementTypes(items));
            }),
        })
    );
};
