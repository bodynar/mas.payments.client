import moment from "moment";

import { isNullOrUndefined } from "@bodynarf/utils/common";
import { delayResolve, delayReject } from "@bodynarf/utils/function";
import { RequestData, safeFetch } from "@bodynarf/utils/api";

import { LoadingStateHideDelay } from "@app/constants";
import { BaseResponseWithResult } from "@app/models/response/baseResponse";

/**
 * Send data to api to process
 * @param uri Api endpoint address
 * @param requestData Request data
 * @returns {Promise<TResult>} Promise with api processing result
 */
export const post = async <TResult>(uri: string, requestData: RequestData): Promise<TResult> => {
    const requestParams: RequestInit = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
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
        method: 'GET',
        headers: {
            'content-type': 'application/json',
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

    return safeFetch<BaseResponseWithResult<TResult>>(uri, requestParams)
        .then((response: BaseResponseWithResult<TResult>) => {
            return response.success
                ? response.result
                : new Promise<TResult>((_, r) => r(response.erorr));
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
        });
};
