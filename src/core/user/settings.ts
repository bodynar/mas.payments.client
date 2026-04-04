import { get, post } from "@app/utils";
import { UpdatedUserSetting, UserSetting, SettingType } from "@app/models/user";

/** Raw user setting shape returned by the API */
interface UserSettingResponse {
    /** Unique identifier */
    id: string;

    /** Display name */
    displayName: string;

    /** Unique code */
    name: string;

    /** Stringified current value */
    rawValue: string;

    /** Value type name as returned by the server (e.g. "String", "Boolean") */
    typeName: string;
}

/**
 * Load user settings from API
 * @returns Promise with array of user settings
 */
export const getUserSettings = async (): Promise<Array<UserSetting>> => {
    const settings = await get<Array<UserSettingResponse>>("api/user/getSettings");

    return settings.map(x => ({
        displayName: x.displayName,
        id: x.id,
        name: x.name,
        rawValue: x.rawValue,
        type: (x.typeName?.toLowerCase() ?? "string") as SettingType,
    }));
};

/**
 * Save updated user settings
 * @param updatedSettings Array of settings to update
 * @returns Promise of sending request to API
 */
export const updateUserSettings = async (updatedSettings: Array<UpdatedUserSetting>): Promise<void> => {
    await post("api/user/updateUserSettings", updatedSettings);
};
