import moment from "moment";

import { isNullOrUndefined, delayResolve, delayReject, RequestData, isNullOrEmpty, ApiResult } from "@bodynarf/utils";
import { safeFetch } from "@bodynarf/utils/api/v2";

import { LoadingStateHideDelay, RequestTimeout } from "@app/constants";

/**
 * Send data to api to process
 * @param uri Api endpoint address
 * @param requestData Request data
 * @returns Promise with api processing result
 */
export const post = async <TResult>(uri: string, requestData: RequestData): Promise<TResult> => {
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
export const get = async <TResult>(uri: string, requestData?: RequestData): Promise<TResult> => {
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
        const { responseObject } = await fetchWithDelay<TResult>(uri, requestParams);
        return responseObject!;
    } catch ({ response, error, code, status }: any) {
        let errorMessage = error as string;

        if (!isNullOrUndefined(response) && !isNullOrEmpty(response)) {
            const errorResponseMessage = JSON.parse((response as any)!)?.Message ?? "";

            if (!isNullOrEmpty(errorResponseMessage)) {
                errorMessage = errorResponseMessage;
            }
        } else {
            errorMessage += ` (${status}: ${code})`;
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
const fetchWithDelay = async<TResult>(uri: string, requestParams: RequestInit): Promise<ApiResult<TResult>> => {
    const start = moment();

    return safeFetch<TResult>(uri, requestParams, {
        timeout: RequestTimeout
    })
        .then((result: ApiResult<TResult>) => {
            const end = moment();

            const duration = moment.duration(end.diff(start)).asSeconds();

            return duration > LoadingStateHideDelay
                ? new Promise<ApiResult<TResult>>(resolve => resolve(result))
                : delayResolve<ApiResult<TResult>>(Math.abs(LoadingStateHideDelay - duration), result);
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

