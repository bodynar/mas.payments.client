import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { ActionWithPayload, CompositeAppState } from "@app/redux";
import { getSetAppIsLoadingAction } from "@app/redux/app";
import { getOpenModalAction, ModalType } from "@app/redux/modal";
import { getSetMeasurementTypesAction } from "@app/redux/measurements";
import { displayError, displaySuccess } from "@app/redux/notificator";

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
        getOpenModalAction({
            modalType: ModalType.Confirm,
            title: "Confirm deleting measurement type",
            buttonCaption: { saveCaption: "Delete" },
            message: `Are you sure want to delete measurement type ${measurementType.caption}?`,
            callback: {
                saveCallback: (): void => {
                    dispatch(getSetAppIsLoadingAction(true));

                    deleteRecordAction(id)
                        .then(() => {
                            displaySuccess(dispatch, getState, false)(`Measurement type [${measurementType.caption}] successfully deleted`);
                        })
                        .then(getMeasurementTypes)
                        .then(items => {
                            dispatch(getSetMeasurementTypesAction(items));
                            dispatch(getSetAppIsLoadingAction(false));
                        })
                        .catch(displayError(dispatch, getState));
                },
                cancelCallback: (): void => { }
            }
        }));
};
