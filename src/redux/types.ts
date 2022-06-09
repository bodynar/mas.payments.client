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
