import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getOpenModalAction, ModalType } from "@app/redux/modal";
import { getSetMeasurementsAction } from "@app/redux/measurements";
import { getNotifications } from "@app/redux/notificator";

import { getMonthName } from "@app/constants";
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
        getOpenModalAction({
            modalType: ModalType.Confirm,
            title: "Confirm deleting measurement",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure want to delete measurement record for ${getMonthName(item.month)} ${item.year} [${item.typeCaption}]?`,
            callback: {
                saveCallback: (): void => {
                    dispatch(getSetAppIsLoadingAction(true));

                    const [displaySuccess, displayError] = getNotifications(dispatch, getState);

                    deleteMeasurement(id)
                        .then(() => {
                            displaySuccess("Measurement record successfully deleted", false);
                        })
                        .then(getMeasurements)
                        .then(measurements => {
                            dispatch(getSetMeasurementsAction(measurements));
                            dispatch(getSetAppIsLoadingAction(false));
                        })
                        .catch(displayError);
                },
            }
        }));
};
