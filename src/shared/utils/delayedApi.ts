import moment from "moment";

import { isNullOrUndefined, isStringEmpty, delayResolve, delayReject, safeFetch, RequestData } from "@bodynarf/utils";

import { LoadingStateHideDelay, RequestTimeout } from "@app/constants";

/**
 * Send data to api to process
 * @param uri Api endpoint address
 * @param requestData Request data
 * @returns Promise with api processing result
 */
export const post = async <TResult>(uri: string, requestData: RequestData): Promise<TResult | undefined> => {
    const requestParams: RequestInit = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(requestData)
    };

    return fetchWithDelay<TResult>(uri, requestParams);
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

    return fetchWithDelay<TResult>(uri, requestParams);
};

/**
 * Fetch data from specific endpoint with delay if needed
 * @param uri Api endpoint address
 * @param requestParams Request data
 * @returns {Promise<TResult>} Promise with api get result
 */
const fetchWithDelay = async<TResult>(uri: string, requestParams: RequestInit): Promise<TResult> => {
    const start = moment();

    return safeFetch(uri, requestParams, {
        timeout: RequestTimeout
    })
        .then((textResponse: string) => {
            const end = moment();

            const result: TResult = isStringEmpty(textResponse)
                ? undefined
                : JSON.parse(textResponse);

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
        });
};
