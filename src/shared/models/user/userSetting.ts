/** User setting */
export interface UserSetting {
    /** Unique positionnumber */
    id: number;

    /** Display name */
    displayName: string;

    /** Data value type */
    type: string;

    /** Stringified value */
    rawValue: string;

    /** Unique code */
    name: string;
}
