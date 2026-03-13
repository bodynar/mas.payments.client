import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { setAppIsLoading } from "@app/redux/app";
import { openModal, ModalType } from "@app/redux/modal";
import { setMeasurements } from "@app/redux/measurements";
import { getNotifications } from "@app/redux/notificator";

import { getMonthName } from "@app/utils";
import { getMeasurements, deleteMeasurement } from "@app/core/measurement";

/**
 * Delete specified measurement
 * @returns Action function that can be called with redux dispatcher
 */
export const deleteRecord = (id: number): ThunkAction<void, CompositeAppState, unknown, ActionWithPayload> => (
    dispatch: ThunkDispatch<CompositeAppState, unknown, ActionWithPayload>,
    getState: () => CompositeAppState
): void => {
    const { measurements } = getState();

    const item = measurements.measurements.find((x) => x.id === id)!;

    dispatch(
        openModal({
            modalType: ModalType.Confirm,
            title: "Confirm deleting measurement",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure you want to delete measurement record for ${getMonthName(item.month)} ${item.year} [${item.typeCaption}]?`,
            callback: (): void => {
                    dispatch(setAppIsLoading(true));

                    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

                    deleteMeasurement(id)
                        .then(() => {
                            displaySuccess("Measurement record successfully deleted", false);
                        })
                        .then(getMeasurements)
                        .then(measurements => {
                            dispatch(setMeasurements(measurements));
                            dispatch(setAppIsLoading(false));
                        })
                        .catch(displayError);
                },
        }));
};
