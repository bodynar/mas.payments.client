import moment from "moment";

import { isNullOrUndefined, delayResolve, delayReject } from "@bodynarf/utils";
import { fetchAsync, HttpError } from "@bodynarf/utils/api";

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
 * @param requestData Request data
 * @returns {Promise<TResult>} Promise with api get result
 */
export const get = async <TResult>(uri: string, requestData?: object): Promise<TResult> => {
    const requestParams: RequestInit = {
        method: "GET",
        headers: {
            "content-type": "application/json",
        }
    };

    if (!isNullOrUndefined(requestData)) {
        requestParams.body = JSON.stringify(requestData);
    }

    return fetchWithApiErrorHandling(uri, requestParams);
};

const fetchWithApiErrorHandling = async <TResult>(uri: string, requestParams: RequestInit): Promise<TResult> => {
    try {
        return await fetchWithDelay<TResult>(uri, requestParams);
    } catch (e: any) {
        let errorMessage: string = e?.message ?? String(e);

        if (e instanceof HttpError) {
            errorMessage = `${e.statusText} (${e.status})`;
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
    const start = moment();

    return fetchAsync<TResult>(uri, requestParams, {
        timeout: RequestTimeout
    })
        .then((result: TResult) => {
            const end = moment();

            const duration = moment.duration(end.diff(start)).asSeconds();

            return duration > LoadingStateHideDelay
                ? new Promise<TResult>(resolve => resolve(result))
                : delayResolve<TResult>(Math.abs(LoadingStateHideDelay - duration), result);
        })
        .catch(error => {
            const end = moment();

            const duration = moment.duration(end.diff(start)).asSeconds();

            if (duration > LoadingStateHideDelay) {
                throw error;
            } else {
                return delayReject(Math.abs(LoadingStateHideDelay - duration), error);
            }
        })
        ;
};

