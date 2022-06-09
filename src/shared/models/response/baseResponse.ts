/** Base api response */
export type BaseResponse = {
    /** Flag determines that api processed with no errors */
    success: boolean;

    /** Api process error */
    erorr: string;  
};

/** Api response with result */
export type BaseResponseWithResult<TResult> = BaseResponse & {
    /** Api response result */
    result: TResult;
};
