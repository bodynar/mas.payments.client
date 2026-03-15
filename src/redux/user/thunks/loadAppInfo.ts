import { version } from "package.json";

import { get } from "@app/utils";

import { ApplicationInfo } from "@app/models/user";

import { createAppAsyncThunk } from "@app/redux";
import { setAppInfo } from "@app/redux/user";

/**
 * Get application info
 */
export const getAppInfo = createAppAsyncThunk(
    async ({ dispatch }) => {
        const appInfo = await get<AppInfoResponse>(`api/user/getAppInfo`);

        dispatch(setAppInfo({
            ...appInfo,
            clientAppVersion: version
        }));
    }
);

type AppInfoResponse = Pick<ApplicationInfo, "dataBaseName" | "serverAppVersion">;
