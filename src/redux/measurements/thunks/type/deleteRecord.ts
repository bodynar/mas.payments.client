import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { openModal, ModalType } from "@app/redux/modal";
import { setMeasurementTypes } from "@app/redux/measurements";
import { getNotifications } from "@app/redux/notificator";

import { deleteTypeRecord as deleteRecordAction, getMeasurementTypes } from "@app/core/measurement";

/**
 * Delete specified measurement type
 * @param id Item identifier
 * @returns Action function that can be called with redux dispatcher
 */
export const deleteTypeRecord = (id: number): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    const { measurements } = getState();

    const measurementType = measurements.availableTypes.find((x) => x.id === id)!;

    dispatch(
        openModal({
            modalType: ModalType.Confirm,
            title: "Confirm deleting measurement type",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure you want to delete measurement type ${measurementType.caption}?`,
            callback: (): void => {
                    dispatch(setAppIsLoading(true));

                    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

                    deleteRecordAction(id)
                        .then(() => {
                            displaySuccess(`Measurement type [${measurementType.caption}] successfully deleted`, false);
                        })
                        .then(getMeasurementTypes)
                        .then(items => {
                            dispatch(setMeasurementTypes(items));
                            dispatch(setAppIsLoading(false));
                        })
                        .catch(displayError);
                },
        }));
};
