import { AppState } from "@app/redux/app";
import { NotificatorState } from "@app/redux/notificator";
import { ModalState } from "@app/redux/modal";
import { UserModuleState } from "@app/redux/user";
import { PaymentModuleState } from "@app/redux/payments";

/** Redux action */
export type Action = {
    /** Unique action code */
    type: string;
};

/** Redux action with some extra payload */
export type ActionWithPayload = Action & {
    /** Action payload data */
    payload: {
        [extraProps: string]: unknown;
    };
};

/** Global application state */
export type CompositeAppState = {
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
};
