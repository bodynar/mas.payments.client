import { delayResolve, delayReject } from "@bodynarf/utils";
import { plainFetchAsync, HttpError } from "@bodynarf/utils/api";

import { LoadingStateHideDelay, RequestTimeout } from "@app/static";

/**
 * Send data to api to process
 * @param uri Api endpoint address
 * @param requestData Request data
 * @returns Promise with api processing result
 */
export const post = async <TResult>(uri: string, requestData: object): Promise<TResult> => {
    const requestParams: RequestInit = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(requestData)
    };


    return fetchWithApiErrorHandling(uri, requestParams);
};

/**
 * Gather data from specified api
 * @param uri Api endpoint address
 * @returns {Promise<TResult>} Promise with api get result
 */
export const get = async <TResult>(uri: string): Promise<TResult> => {
    const requestParams: RequestInit = {
        method: "GET",
        headers: {
            "content-type": "application/json",
        }
    };

    return fetchWithApiErrorHandling(uri, requestParams);
};

const fetchWithApiErrorHandling = async <TResult>(uri: string, requestParams: RequestInit): Promise<TResult> => {
    try {
        return await fetchWithDelay<TResult>(uri, requestParams);
    } catch (e: unknown) {
        let errorMessage: string;

        if (e instanceof HttpError) {
            errorMessage = `${e.statusText} (${e.status})`;
        } else if (e instanceof Error) {
            errorMessage = e.message;
        } else {
            errorMessage = String(e);
        }

        throw new Error(errorMessage);
    }
};

/**
 * Fetch data from specific endpoint with delay if needed
 * @param uri Api endpoint address
 * @param requestParams Request data
 * @returns {Promise<TResult>} Promise with api get result
 */
const fetchWithDelay = async<TResult>(uri: string, requestParams: RequestInit): Promise<TResult> => {
    const start = Date.now();

    return plainFetchAsync(uri, requestParams, {
        timeout: RequestTimeout
    })
        .then(async (response: Response) => {
            const text = await response.text();
            const result: TResult = text.length > 0 ? JSON.parse(text) : undefined;
            const duration = (Date.now() - start) / 1000;

            return duration > LoadingStateHideDelay
                ? Promise.resolve(result)
                : delayResolve<TResult>(Math.abs(LoadingStateHideDelay - duration), result);
        })
        .catch(error => {
            const duration = (Date.now() - start) / 1000;

            if (duration > LoadingStateHideDelay) {
                throw error;
            } else {
                return delayReject(Math.abs(LoadingStateHideDelay - duration), error);
            }
        })
        ;
};

