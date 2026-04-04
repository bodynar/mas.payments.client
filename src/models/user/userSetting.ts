/** Supported setting value types */
export type SettingType = "string" | "boolean";

/** User setting */
export interface UserSetting {
    /** Unique identifier */
    id: string;

    /** Display name */
    displayName: string;

    /** Data value type */
    type: SettingType;

    /** Stringified value */
    rawValue: string;

    /** Unique code */
    name: string;
}
