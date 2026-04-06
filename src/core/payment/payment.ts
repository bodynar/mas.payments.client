import { isNullish } from "@bodynarf/utils";

import { get, post } from "@app/utils";
import { groupByYearMonth } from "@app/core";
import { AddPayment, AddPaymentGroup, Payment, PaymentGroup, PaymentResponse, SavePaymentData, UpdatePayment } from "@app/models/payments";

/**
 * Save payment card with data
 * @param data Typed form data
 * @param id Payment identifier for update; omit for create
 * @returns Promise of sending request to API
 */
export const saveCard = (data: SavePaymentData, id?: string): Promise<void> => {
    const isNewRecord = isNullish(id);

    const paymentApiModel: AddPayment | UpdatePayment = isNewRecord
        ? data
        : { ...data, id: id! };

    return post(
        isNewRecord ? "api/payment/addPayment" : "api/payment/updatePayment",
        paymentApiModel,
    );
};

/**
 * Delete specified payment record
 * @param id Payment identifier
 * @returns Promise of sending request to API
 */
export const deleteRecord = (id: string): Promise<void> => {
    return post("api/payment/deletePayment", { id });
};

/**
 * Load all available payment records
 * @returns Promise with array of loaded payments
 */
export const getPaymentRecords = async (): Promise<Array<Payment>> => {
    const payments = await get<Array<PaymentResponse>>("api/payment/getPayments");

    return payments.map(x => ({
        id: x.id,
        month: x.dateMonth,
        year: x.dateYear,
        price: x.amount,
        typeId: x.paymentTypeId,
        description: x.description,
        paymentGroupId: x.paymentGroupId ?? undefined,
        paymentFile: x.paymentFile ?? undefined,
    }));
};

/**
 * Group payments by year and month
 * @param payments Payment records
 * @param isAscOrder Sort groups ascendingly by month&year
 * @returns Array of grouped payments
 */
export const groupPayments = (
    payments: Array<Payment>,
    isAscOrder: boolean,
): Array<PaymentGroup> => groupByYearMonth(payments, isAscOrder);

/**
 * Create a payment group
 * @param groupData Payment group data
 * @returns Promise of sending request to API
 */
export const createPaymentGroup = (groupData: AddPaymentGroup): Promise<void> => {
    return post("api/payment/AddGroup", {
        paymentDate: groupData.paymentDate,
        month: groupData.month,
        year: groupData.year,
        comment: groupData.comment,
        payments: groupData.payments.map(({ amount, description, paymentTypeId }) => ({
            amount,
            description,
            paymentTypeId,
        })),
    });
};

/**
 * Validate single payment group item
 * @param item Payment group item to validate
 * @returns Validation error or undefined
 */
export const validatePaymentGroupItem = (
    { paymentTypeId, amount }: { paymentTypeId?: string; amount?: number },
): string | undefined => {
    if (isNullish(paymentTypeId)) {
        return "Type is not selected";
    }
    if (isNullish(amount)) {
        return "Amount is not valid";
    }
    if (amount! <= 0) {
        return "Amount cannot be less than or equal to 0";
    }
    return undefined;
};
