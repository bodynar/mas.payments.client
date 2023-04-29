import { AppState } from "@app/redux/app";
import { NotificatorState } from "@app/redux/notificator";
import { ModalState } from "@app/redux/modal";
import { UserModuleState } from "@app/redux/user";
import { PaymentModuleState } from "@app/redux/payments";
import { MeasurementModuleState } from "@app/redux/measurements";
import { StatisticsModuleState } from "@app/redux/stats";

/** Redux action */
export interface Action {
    /** Unique action code */
    type: string;
}

/** Redux action with some extra payload */
export interface ActionWithPayload extends Action {
    /** Action payload data */
    payload: {
        [extraProps: string]: unknown;
    };
}

/** Global application state */
export interface CompositeAppState {
    /** Modal box state */
    modal: ModalState;

    /** Notifications module state */
    notificator: NotificatorState;

    /** Application misc state */
    app: AppState;

    /** User module state */
    user: UserModuleState;

    /** Payments module state */
    payments: PaymentModuleState;

    /** Measurements module state */
    measurements: MeasurementModuleState;

    /** Statistics charts module */
    stats: StatisticsModuleState;
}
