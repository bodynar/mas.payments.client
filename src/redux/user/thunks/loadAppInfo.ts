import { createAppAsyncThunk } from "@app/redux";
import { setAppInfo } from "@app/redux/user";

import { getAppInfo as getAppInfoApi } from "@app/core/user";

/**
 * Get application info
 */
export const getAppInfo = createAppAsyncThunk(
    async ({ dispatch }) => {
        const appInfo = await getAppInfoApi();

        dispatch(setAppInfo({
            ...appInfo,
            clientAppVersion: __APP_VERSION__
        }));
    }
);
