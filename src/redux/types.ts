import { ModalState } from "./modal/types";
import { NotificatorState } from "./notificator/types";
import { AppState } from "./app/types";
import { UserModuleState } from "./user/types";
import { PaymentModuleState } from "./payments/types";

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
