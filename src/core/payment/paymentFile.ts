import { isNotNullish } from "@bodynarf/utils";

import { get, post, postFile } from "@app/utils";

/** Minimal payment group shape needed to resolve the new group's id after creation */
interface PaymentGroupIdResponse {
    id: string;
}

/**
 * Fetch the set of payment group ids for a given month and year.
 * Used to detect which group was just created.
 * @param month Month (1-12)
 * @param year Year
 * @returns Set of existing group ids
 */
export const getPaymentGroupIdsByMonthYear = async (month: number, year: number): Promise<Set<string>> => {
    const groups = await get<Array<PaymentGroupIdResponse>>(
        `api/payment/GetPaymentGroups?month=${month}&year=${year}`
    );
    return new Set(groups.map(g => g.id));
};

/**
 * Upload a PDF file and attach it to a payment or payment group.
 * Exactly one of paymentId / paymentGroupId must be provided.
 * @param file PDF file to upload (max 25 MB)
 * @param paymentId Id of the payment to attach the file to
 * @param paymentGroupId Id of the payment group to attach the file to
 */
export const uploadPaymentFile = (
    file: File,
    paymentId?: string,
    paymentGroupId?: string,
): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);

    if (isNotNullish(paymentId)) {
        formData.append("paymentId", paymentId);
    }
    if (isNotNullish(paymentGroupId)) {
        formData.append("paymentGroupId", paymentGroupId);
    }

    return postFile("api/paymentFile/UploadFile", formData);
};

/**
 * Delete an attached payment file by its id.
 * @param id Payment file identifier
 * @returns Promise of sending request to API
 */
export const deletePaymentFile = (id: string): Promise<void> => {
    return post("api/paymentFile/DeleteFile", { id });
};
