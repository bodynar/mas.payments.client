import { get, post } from "@app/utils";
import { UpdatedUserSetting, UserSetting } from "@app/models/user";

/**
 * Load user settings from API
 * @returns Promise with array of user settings
 */
export const getUserSettings = async (): Promise<Array<UserSetting>> => {
    const settings = await get<Array<Record<string, unknown>>>("api/user/getSettings");

    return settings.map(x => ({
        displayName: x["displayName"],
        id: x["id"],
        name: x["name"],
        rawValue: x["rawValue"],
        type: (x["typeName"] as string).toLowerCase(),
    }) as UserSetting);
};

/**
 * Save updated user settings
 * @param updatedSettings Array of settings to update
 * @returns Promise of sending request to API
 */
export const updateUserSettings = async (updatedSettings: Array<UpdatedUserSetting>): Promise<void> => {
    await post("api/user/updateUserSettings", updatedSettings);
};
