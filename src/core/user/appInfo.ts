import { get } from "@app/utils";
import { ApplicationInfo } from "@app/models/user";

type AppInfoResponse = Pick<ApplicationInfo, "dataBaseName" | "serverAppVersion">;

/**
 * Load application info from API
 * @returns Promise with server application info
 */
export const getAppInfo = async (): Promise<AppInfoResponse> => {
    return get<AppInfoResponse>("api/user/getAppInfo");
};
