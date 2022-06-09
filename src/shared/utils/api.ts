/* eslint-disable no-undef */
import { isNullOrUndefined } from "@bodynarf/utils/common";

import { BaseResponseWithResult } from "@app/models/response/baseResponse";

/** Request body data */
export type RequestData = {
    [propertyName: string]: any;
} | string;

/** Map of http status codes to errors */
export const statusCodesErrorsMap = new Map<number, string>([
    [404, "Server is not reachable."],
    [415, "Server request failed: data is not valid."]
]);

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

    return safeFetch<TResult>(uri, requestParams);
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

    return safeFetch<TResult>(uri, requestParams);
};

/**
 * Send configured http request to specified api with error handling
 * @param uri Uri addres to fetch
 * @param requestParams Request parameters
 * @returns Fetch result: error message or requested typed result
 */
export const safeFetch = async <TResult>(uri: string, requestParams: RequestInit): Promise<TResult> => {
    try {
        const response: Response = await fetch(uri, requestParams);

        if (response.ok) {
            const baseResponse: BaseResponseWithResult<TResult> = await response.json();

            if (baseResponse.success) {
                return Promise.resolve(baseResponse.result);
            } else {
                return Promise.reject(new Error(baseResponse.erorr));
            }
        } else {
            return Promise.reject(getErrorText(response));
        }
    } catch (error) {
        console.error(error);
        return Promise.reject("Unexpected error.");
    }
};

/**
 * Get error message depending on http response
 * @param response Http response
 * @returns Error message to display
 */
export const getErrorText = (response: Response): string => {
    if (response.ok) {
        throw new Error("Response is ok, but error handler called.");
    }

    if (!statusCodesErrorsMap.has(response.status)) {
        return "Unexpected error.";
    }

    return statusCodesErrorsMap.get(response.status) as string;
};
